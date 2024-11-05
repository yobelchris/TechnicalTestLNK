import jwt from 'jsonwebtoken';
import JWTPayload from "./JWTPayload";
import {UserAuthError} from "../errors/AuthError";

export default class JWTHelper {
    private tokenSecret: string = 'jwt-secret';
    private refreshTokenSecret: string = 'jwt-refresh-secret';
    private tokenExpiresIn: string | number = '30m'; // 30 minutes
    private refreshTokenExpiresIn: string | number = '1d'; // 1 day
    constructor(secret?: string, refreshSecret?: string, expiresIn?: string | number, refreshExpiresIn?: string | number) {
        if(secret) {
            this.tokenSecret = secret;
        }
        if(refreshSecret) {
            this.refreshTokenSecret = refreshSecret;
        }
        if(expiresIn) {
            this.tokenExpiresIn = expiresIn;
        }
        if(refreshExpiresIn) {
            this.refreshTokenExpiresIn = refreshExpiresIn;
        }
    }

    public GenerateToken(payload: JWTPayload): string {
        return jwt.sign({...payload}, this.tokenSecret, {expiresIn: this.tokenExpiresIn});
    }

    public GenerateRefreshToken(payload: JWTPayload): string {
        return jwt.sign(payload, this.refreshTokenSecret, {expiresIn: this.refreshTokenExpiresIn});
    }

    public VerifyToken(token: string): JWTPayload {
        const verifyResult = jwt.verify(token, this.tokenSecret);

        if (verifyResult && typeof verifyResult === 'object' && 'id' in verifyResult && typeof verifyResult['id'] === 'string') {
            return new JWTPayload((verifyResult as jwt.JwtPayload).id);
        } else {
            throw new UserAuthError('Invalid token payload format');
        }
    }

    public VerifyRefreshToken(token: string): JWTPayload {
        const verifyResult = jwt.verify(token, this.refreshTokenSecret);

        if (verifyResult && typeof verifyResult === 'object' && 'id' in verifyResult && typeof verifyResult['id'] === 'string') {
            return new JWTPayload((verifyResult as jwt.JwtPayload).id);
        } else {
            throw new UserAuthError('Invalid token payload format');
        }
    }
}