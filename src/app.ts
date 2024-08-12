
import express from "express";
import initRoutes from "./routes";
import passport from "passport";
import passportJwtInit from "@config/passportJwt";
import cors from 'cors'
import passportHttpInit from "@config/passportHttp";
import expressRateLimite from "@config/expressRateLimiter";
import expressSlowDown from "@config/expressSlowDowner";
import morgan from "@config/morgan";
const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); // enable cors
app.options(process.env.CORS_ORIGIN, cors<Request>())
app.use(passport.initialize()); // passport  authentication initialize
passport.use("basic", passportHttpInit); // passport Http authentication initialize
passport.use("jwt", passportJwtInit); // passport jwt authentication initialize

if(process.env.NODE_ENVIRONMENT === 'production')
{    
    app.use(expressRateLimite);  
    app.use(expressSlowDown);
}

initRoutes(app); // routes

export default app;
