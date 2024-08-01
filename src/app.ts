require("dotenv").config();

import express from "express";
import initRoutes from "./routes";
import passport from "passport";
import passportJwtInit from "@config/passportJwt";
import cors from 'cors'
import passportHttpInit from "@config/passportHttp";
const app = express();

app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); // enable cors
app.options(process.env.CORS_ORIGIN, cors<Request>())
app.use(passport.initialize()); // passport  authentication initialize

passport.use("basic", passportHttpInit); // passport Http authentication initialize
passport.use("jwt", passportJwtInit); // passport jwt authentication initialize


initRoutes(app); // routes

export default app;
