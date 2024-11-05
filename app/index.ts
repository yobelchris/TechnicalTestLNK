import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {Connection} from "../database/mongodb/Connection";
import UserRepository from "../repositories/user/mongodb/UserRepository";
import UserUsecase from "../cores/user/usecase/UserUsecase";
import UserHandler from "../handlers/http/user/UserHandler";
import JWTHelper from "../libs/jwt/JWTHelper";
import JWTAuth from "../middlewares/http/auth/JWTAuth";
import EmailRepository from "../repositories/email/mongodb/EmailRepository";
import EmailUsecase from "../cores/email/usecase/EmailUsecase";
import EmailClient from "../libs/email/EmailClient";
import EmailHandler from "../handlers/http/email/EmailHandler";

dotenv.config();

const jwtHelper = new JWTHelper(process.env.TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET, process.env.TOKEN_EXPIRES_IN, process.env.REFRESH_TOKEN_EXPIRES_IN);
const emailClient = new EmailClient(process.env.EMAIL_USER? process.env.EMAIL_USER : "", process.env.EMAIL_PASSWORD? process.env.EMAIL_PASSWORD : "");

const mongoConnection = Connection.Connect();
const userRepository = new UserRepository(mongoConnection, process.env.DATABASE_SEED? process.env.DATABASE_SEED === "true" : false);
const emailRepository = new EmailRepository(mongoConnection);

const userUsecase = new UserUsecase(userRepository);
const emailUsecase = new EmailUsecase(emailRepository, emailClient);

const userHandler = new UserHandler(userUsecase, jwtHelper);
const emailHandler = new EmailHandler(emailUsecase);

const jwtAuth = new JWTAuth(jwtHelper, userUsecase);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());

app.post("/login", userHandler.Login);
app.put("/refresh", jwtAuth.AuthRefreshMiddleware, userHandler.RefreshToken);
app.post("/logout", jwtAuth.AuthMiddleware, userHandler.Logout);
app.post("/email", jwtAuth.AuthMiddleware, emailHandler.SendEmail);
app.get("/email", jwtAuth.AuthMiddleware, emailHandler.GetEmail);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});