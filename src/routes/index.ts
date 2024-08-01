import ApiError from "@utils/apiError";
import authRoute from "./auth.route";
import homeRouter from "./home.route";
import httpStatus from "http-status";
import apiResponse from "@utils/apiResponse";

const initRoutes = (app : any) =>{

    app.use('/', homeRouter);

    app.use('/auth', authRoute);


    // send back a 404 error for any unknown api request
    app.use((req: Request, res: Response, next: NextFunction) => {
        const err = new ApiError(httpStatus.NOT_ACCEPTABLE, "Invalid Url")
        return next();
    })

    // Error Handle middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

        const status = err.statusCode || res.statusCode || 500;
        const stack = process.env.NODE_ENVIRONMENT != "production" ? err?.stack : {}
        return apiResponse(res, status, {message: err.message}, stack)
    })

}

export default initRoutes;