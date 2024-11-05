import {Request} from "express";
import JWTPayload from "../jwt/JWTPayload";

export default interface AuthenticatedRequest extends Request {
    user?: JWTPayload
}