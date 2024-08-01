import { login, logout, register, resetPassword } from "@controllers/auth.controller";
import { isAuthenticated, isClientAuthenticated } from "@middlewares/auth.middleware";
import { loginValidation, registerValidation, resetPasswordValidation } from "@validations/auth.validation";
import express from "express";

const routes = express.Router();

routes.post("/login",isClientAuthenticated, loginValidation, login);
routes.post("/register", isClientAuthenticated, registerValidation, register)
routes.post("/reset-password",isClientAuthenticated, resetPasswordValidation, resetPassword)
routes.delete("/logout", isAuthenticated, logout);

export default routes;
