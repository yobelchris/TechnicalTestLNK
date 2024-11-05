import {ConvertZodErrorToMapString} from "../../../libs/zod/Convert";
import {IUserUsecase} from "../../../cores/user/usecase/UserUsecase";
import {LoginRequestValidation, LoginRequest} from "./request/RequestPayload";
import {Request, Response} from "express";
import StandardResponse from "../../../libs/response/StandardResponse";
import BaseError from "../../../libs/errors/BaseError";
import {UserAuthError} from "../../../libs/errors/AuthError";
import JWTHelper from "../../../libs/jwt/JWTHelper";
import {LoginResponse, RefreshTokenResponse} from "./response/ResponsePayload";
import AuthenticatedRequest from "../../../libs/request/AuthenticatedRequest";

export default class UserHandler {
    private usecase: IUserUsecase;
    private jwtHelper: JWTHelper;

    constructor(usecase: IUserUsecase, jwtHelper: JWTHelper) {
        this.usecase = usecase;
        this.jwtHelper = jwtHelper;
    }

    public Login = async (req: Request, res: Response): Promise<void> => {
        let reqPayload: LoginRequest;
        let response: StandardResponse = new StandardResponse();
        try{
            const reqValidation = LoginRequestValidation.safeParse(req.body);

            if(!reqValidation.success) {
                response.message = "please check your payload";
                response.validationErrors = ConvertZodErrorToMapString(reqValidation.error);

                res.status(400).json(response.toObject());
                return;
            }

            reqPayload = reqValidation.data;
        }catch (e: any) {
            console.error("ERROR LOGIN REQUEST VALIDATION : ", e)
            response.message = "validation error";
            res.status(500).json(response.toObject());
            return;
        }

        try{
            const user = await this.usecase.Login(reqPayload.username, reqPayload.password)

            const token = this.jwtHelper.GenerateToken({
                id: user.id
            });

            const refreshToken = this.jwtHelper.GenerateRefreshToken({
                id: user.id
            });

            await this.usecase.UpdateRefreshToken(user.id, refreshToken);

            response.message = "login success";
            response.data = new LoginResponse(token, refreshToken);
            res.status(200).json(response.toObject());
            return;
        }catch (e: any) {
            console.error("ERROR LOGIN : ", e)
            if(e instanceof UserAuthError) {
                response.message = "please check your username and password";
                res.status(e.statusCode).json(response.toObject());
                return;
            }

            if(e instanceof BaseError) {
                response.message = e.message;
                res.status(e.statusCode).json(response.toObject());
                return;
            }

            response.message = "login error";
            res.status(500).json(response);
            return;
        }
    }

    public RefreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let response: StandardResponse = new StandardResponse();
        try {
            if (!req.user) {
                throw new UserAuthError();
            }

            const token = this.jwtHelper.GenerateToken({
                id: req.user.id
            });

            const refreshToken = this.jwtHelper.GenerateRefreshToken({
                id: req.user.id
            });

            await this.usecase.UpdateRefreshToken(req.user.id, refreshToken);

            response.message = "refresh token success";
            response.data = new RefreshTokenResponse(token, refreshToken)
            res.status(200).json(response.toObject());
        } catch (e: any) {
            console.error("ERROR REFRESH TOKEN : ", e)
            if(e instanceof BaseError) {
                response.message = e.message;
                res.status(e.statusCode).json(response.toObject());
                return;
            }

            response.message = "refresh token error";
            res.status(500).json(response.toObject());
            return;
        }
    }

    public Logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        let response: StandardResponse = new StandardResponse();
        try{
            if(!req.user) {
                throw new UserAuthError();
            }

            const user = await this.usecase.GetUserById(req.user.id);
            await this.usecase.Logout(user.id);
            await this.usecase.UpdateRefreshToken(user.id, "");
            response.message = "logout success";
            res.status(200).json(response.toObject());
            return;
        }catch (e: any) {
            console.error("ERROR LOGOUT : ", e)
            if(e instanceof BaseError) {
                response.message = e.message;
                res.status(e.statusCode).json(response.toObject());
                return;
            }

            response.message = "logout error";
            res.status(500).json(response.toObject());
            return;
        }
    }
}