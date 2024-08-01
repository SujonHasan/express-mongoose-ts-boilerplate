import { OAuthAccessTokenModel } from "@models/oAuthAccessToken.model";
import { OAuthRefreshTokenModel } from "@models/oAuthRefreshToken.model";
import ApiError from "@utils/apiError";
import catchAsync from "@utils/catchAsync";
import { error } from "console";
import httpStatus from "http-status";
import moment from "moment";
import passport from "passport";

const verifyCallback =
  (req: any, resolve: () => void, reject: (error: ApiError) => void) =>
  async (err: Error, user: any, info: any) => {
    // this is done funciton

    if (err || !(info || user)) {
      const error = new ApiError(
        httpStatus.UNAUTHORIZED,
        "Session expired. Please login again. "
      );

      return reject(error);
    }

    const oAuthTokenDetail = await OAuthAccessTokenModel.findOne({
      accessToken: req.headers.authorization.split(" ")[1],
      revoked: false,
      expires: { $gte: moment().format() },
    });

    if (oAuthTokenDetail) {
      const oAuthRefreshDetail = await OAuthRefreshTokenModel.findOne({
        accessToken: oAuthTokenDetail?.accessToken,
        revoked: false,
        expires: { $gte: moment().format() },
      });

      if (oAuthRefreshDetail) {
        req.user = user;
        req.access = oAuthTokenDetail;
        req.refresh = oAuthRefreshDetail;
        return resolve();
      }
    }

    const error = new ApiError(
      httpStatus.UNAUTHORIZED,
      "Session expired. Please login again."
    );
    return reject(error);
  };

const isAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise<void>((resolve, reject) => {
      return passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  }
);

const isClientVerifyCallback = (req: Request, resolve: ()=> void, reject: (err: Error) => void ) => async(err: Error, user: any, info: any) =>{
  
  if(err || info ||  !user){
    const error = new ApiError(httpStatus.NOT_ACCEPTABLE, "Invalid Client");
    return reject(error);
  }

  req.client = user;
  return resolve();
}


const isClientAuthenticated = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

  return new Promise<void>((resolve, reject) => {
      return passport.authenticate('basic', isClientVerifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err))
})

export { isAuthenticated, isClientAuthenticated };
