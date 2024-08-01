import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import apiResponse from "./apiResponse";

export default (fn: any) => (req: Request, res: Response, next: NextFunction) =>{

    return Promise
            .resolve(fn(req, res, next))
            .catch(err => apiResponse(res, httpStatus.BAD_REQUEST, {message: 'message' in err ? err.message : "Something went wrong"}));
}