import JWTHelper from "../../../libs/jwt/JWTHelper";
import {IUserUsecase} from "../../../cores/user/usecase/UserUsecase";
import {Request, Response, NextFunction} from "express";
import JWTPayload from "../../../libs/jwt/JWTPayload";
import StandardResponse from "../../../libs/response/StandardResponse";
import BaseError from "../../../libs/errors/BaseError";
import {UserAuthError} from "../../../libs/errors/AuthError";
import AuthenticatedRequest from "../../../libs/request/AuthenticatedRequest";

export default class JWTAuth {
    private jwtHelper: JWTHelper;
    private userUsecase: IUserUsecase;
    constructor(jwtHelper: JWTHelper, userUsecase: IUserUsecase) {
        this.jwtHelper = jwtHelper;
        this.userUsecase = userUsecase;
    }

    public AuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        let response = new StandardResponse();

        if(!req.headers['authorization']) {
            response.message = 'Invalid token';
            res.status(401).json(response);
            return;
        }

        const token = req.headers['authorization']?.split(' ');
        if(token[0] === 'Bearer' && token.length === 2) {
            let payload: JWTPayload;
            try{
                payload = this.jwtHelper.VerifyToken(token[1].trim());
            }catch (e: any) {
                console.error("ERROR VERIFY TOKEN : ", e);
                response.message = 'invalid token';
                res.status(401).json(response);
                return;
            }

            try {
                const user = await this.userUsecase.GetUserById(payload.id);

                if(user.refreshToken === "") {
                    throw new UserAuthError();
                }

                req.user = user;
                next();
            } catch (e: any) {
                console.error("ERROR GET USER BY ID FOR ACCESS TOKEN : ", e);
                if(e instanceof BaseError){
                    response.message = e.message;
                    res.status(e.statusCode).json(response);
                    return;
                }

                response.message = 'token auth failed';
                res.status(500).json(response);
                return;
            }
        } else {
            response.message = 'invalid token';
            res.status(401).json(response);
            return;
        }
    }

    public AuthRefreshMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        let response = new StandardResponse();

        if(!req.headers['authorization']) {
            response.message = 'Invalid token';
            res.status(401).json(response);
            return;
        }

        const token = req.headers['authorization']?.split(' ');
        if(token[0] === 'Bearer' && token.length === 2) {
            let payload: JWTPayload;
            try{
                payload = this.jwtHelper.VerifyRefreshToken(token[1].trim());
            }catch (e: any) {
                console.error("ERROR VERIFY REFRESH TOKEN : ", e);
                response.message = 'invalid token';
                res.status(401).json(response);
                return;
            }

            try {
                const user = await this.userUsecase.GetUserById(payload.id);

                if(token[1].trim() !== user.refreshToken) {
                    throw new UserAuthError();
                }

                req.user = user;
                next();
            } catch (e: any) {
                console.error("ERROR GET USER BY ID FOR REFRESH TOKEN : ", e);
                if(e instanceof BaseError){
                    response.message = e.message;
                    res.status(e.statusCode).json(response);
                    return;
                }

                response.message = 'token auth failed';
                res.status(500).json(response);
                return;
            }
        } else {
            response.message = 'invalid token';
            res.status(401).json(response);
            return;
        }
    }
}