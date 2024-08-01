import { OAuthAccessTokenModel } from "@models/oAuthAccessToken.model";
import { OAuthRefreshTokenModel } from "@models/oAuthRefreshToken.model";
import { RoleModel } from "@models/role.model";
import { UserModel, UserStatus } from "@models/user.model";
import apiResponse from "@utils/apiResponse";
import catchAsync from "@utils/catchAsync";
import validationError from "@utils/validationError";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import moment from "moment";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const generateToken = (user: any, exp: moment.Moment, secret: string) => {
  return jwt.sign(
    {
      sub: user,
      iat: moment().unix(),
      exp: exp.unix(),
    },
    secret
  );
};

const OAuthAccessTokenDetail = async ( accessToken: string, user: any, permissions: string[], exp: moment.Moment) => {
  const data = new OAuthAccessTokenModel({
    user: user._id,
    accessToken: accessToken,
    scopes: permissions,
    revoked: false,
    expires: exp,
  });

  return await data.save();
};

const OAuthRefreshTokenDetail = async ( refreshToken: string, accessTokenDetail: any, user: any, exp2: moment.Moment ) => {

  const data = new OAuthRefreshTokenModel({
    user: user._id,
    refreshToken: refreshToken,
    accessToken: accessTokenDetail.accessToken,
    revoked: false,
    expires: exp2,
  });

  return await data.save();
};

const accessTokenDetailsAndRefreshTokenDetails = async (user: any, permissions: string[]) =>{

    const exp = moment().add(parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES ?? ""), 'minute');
    const accessToken = await generateToken(user, exp, process.env.JWT_ACCESS_SECRET ?? "");
    const exp2 = moment().add(parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? ""), 'days');
    const refreshToken = await generateToken(user, exp2, process.env.JWT_REFRESH_SECRET ?? "");

    const accessTokenDetail = await OAuthAccessTokenDetail(accessToken, user, permissions, exp);
    const refreshTokenDetail = await OAuthRefreshTokenDetail(refreshToken,  accessTokenDetail, user, exp2);
  
    return {accessTokenDetail, refreshTokenDetail};
}

const register = catchAsync(async (req: any, res: Response) => {

    const {email, username, password, firstName, lastName, phone, gender, superAdmin} = req.body;

    const newUser = new UserModel({email, username, password, personal: {firstName, lastName, phone, gender}, superAdmin});
    
    const err = newUser.validateSync();

    if(err instanceof mongoose.Error){
        const validation = await validationError.requiredCheck(err.errors);
        
        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY)
    }

    const validation = await validationError.uniqueCheck(await UserModel.isUnique(username, email));

    if(Object.keys(validation).length > 0){

        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "Validation Required"}, validation)
    }

    const user = await newUser.save();

    const {accessTokenDetail, refreshTokenDetail} = await accessTokenDetailsAndRefreshTokenDetails(user, []);

    return apiResponse(res, httpStatus.CREATED,{
        data: {
            access: {
                token: accessTokenDetail.accessToken,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail.refreshToken,
                expires: refreshTokenDetail.expires,
            },
            user,
        },
        message: "Registration Successfull",
    })
})

const login = catchAsync( async(req: any, res: Response) => {

    const {email, password} = req.body;
    
    const user  = await UserModel.findOne({
        status: UserStatus.active,
        $or: [{email: email}, {username: email}]
    })

    if(!user){
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: "Invalid email or username, Please register first..."
        })
    }else if(!(await user.comparePassword(password))){
        return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {
            message: "Password not matched"
        })
    }

    const roleInfo = await RoleModel.findOne({_id: user.role._id});

    const {accessTokenDetail, refreshTokenDetail } = await accessTokenDetailsAndRefreshTokenDetails(
        user,
        roleInfo && roleInfo.permissions ? roleInfo.permissions : [] 
    );    

    return apiResponse(res, httpStatus.CREATED,{
        data: {
            access: {
                token: accessTokenDetail.accessToken,
                expires: accessTokenDetail.expires,
            },
            refresh: {
                token: refreshTokenDetail.refreshToken,
                expires: refreshTokenDetail.expires,
            },
            user: user,
            scopes: roleInfo && roleInfo.permissions ? roleInfo?.permissions : [],
        },
        message: "Login Successfull",
    })
} )

const logout = catchAsync( async(req: any, res: Response) =>{

    const accessToken = req?.headers?.authorization?.split(' ')[1];        

    if(accessToken){
        const accessDetails = await OAuthAccessTokenModel.findOneAndUpdate({accessToken}, {revoked: true});
        await OAuthRefreshTokenModel.updateOne({accessToken: accessDetails?.accessToken}, {revoked: true});

        return apiResponse(res, httpStatus.ACCEPTED, {
            message: "Logout Successful",
        });
    }

    return apiResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Session expied. please login again",
    });
})

const resetPassword = catchAsync(async(req: Request, res: Response) => {

    const {accessToken, password} = req.body;    
    
    const accessDetails = await OAuthAccessTokenModel.findOne({accessToken: accessToken.substr(7), revoked: false});

    if(accessDetails.user._id){

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hashSync(password, salt);

        await UserModel.updateOne({_id: accessDetails.user._id}, {$set: {password: pass}});

        return apiResponse(res, httpStatus.ACCEPTED, {message: "Password Update"})
    }
    
    return apiResponse(res, httpStatus.NOT_ACCEPTABLE, {message: "User not Found"});
})

export { login, logout , register, resetPassword};
