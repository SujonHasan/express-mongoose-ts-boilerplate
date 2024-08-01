import { Response } from "express";

const apiResponse = (res: Response, status: number, data = {} as {data?: any, message?: any}, optional = {}) =>{

    const returnObject = {} as {data: any, message: string | null, stack: any};

    returnObject["data"] = data?.data ? data.data : null;
    returnObject["message"] = data?.message ? data.message : null;
    returnObject["stack"] = typeof optional !== 'undefined' && Object.keys(optional).length > 0 ? optional : null;

    res.status(status);
    return res.json(returnObject);
}

export default apiResponse;