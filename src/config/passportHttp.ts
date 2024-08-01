import catchAsync from "@utils/catchAsync";

const passportHttp = require("passport-http");

const passportHttpInit = new passportHttp.BasicStrategy( catchAsync( async(name: string, secret: string, done: any) => {

    const client = name === process.env.JWT_BASIC_USER && secret === process.env.JWT_BASIC_SECRET ? {name, secret} : null;

    if(!client) return done("Client not Found", client);

    return done(null, client)
}) )

export default passportHttpInit;