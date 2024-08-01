import { UserModel } from "@models/user.model";
import catchAsync from "@utils/catchAsync";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

const passportJwtInit = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET,
  },
  catchAsync(async (jwtPayload: any, done: VerifiedCallback) => {
    const user = await UserModel.findOne({ _id: jwtPayload.sub._id });
    
    if (!user) done(true, false);

    return done(false, user, jwtPayload);
  })
);

export default passportJwtInit;
