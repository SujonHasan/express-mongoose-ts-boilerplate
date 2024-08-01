import { NextFunction } from "express";
import { pick } from "lodash";
import apiResponse from "./apiResponse";
import httpStatus from "http-status";
import Joi from "joi";

const validate = (schema: object) => async (req: Request, res: Response, next: NextFunction) => {

    const validSchema = pick(schema, ["params", "query", "body"]);

    const object = pick(req, Object.keys(validSchema));

    const {value, error} = Joi.compile(validSchema)
                            .prefs({errors: {label: "key"}})
                            .validate(object, {abortEarly: false})

    if(error){

        const message = error && error.details && error.details.length ? error.details[0].message : "Validation Error..";

        const err: typeValidationError = {};        

        error.details.forEach((e) =>{
            err[e.path[1]] = e.message.toString();
        });

        return apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {message}, err);
    }    

    Object.assign(req,value);

    return next();
}

export {
    validate
}