import {Connection} from "mongoose";
import User from "./model/User";
import UserDTO from "../../../cores/user/dto/UserDTO";
import CoreIUserRepository from "../../../cores/user/repository/IUserRepository";
import {DataNotFound, DataNotUpdated} from "../../../libs/errors/DataError";

export default class UserRepository implements CoreIUserRepository {
    private user: User

    constructor(conn: Connection, isSeeding: boolean = false) {
        this.user = new User(conn, isSeeding);
    }

    public async GetUserByUsername(username: string): Promise<UserDTO> {
        const user = await this.user.getModel().findOne({username: username});

        if(!user) {
            throw new DataNotFound("user not found");
        }

        return this.user.ToCore(user);
    }

    public async GetUserById(id: string): Promise<UserDTO> {
        const user = await this.user.getModel().findById(id);

        if(!user) {
            throw new DataNotFound("user not found");
        }

        return this.user.ToCore(user);
    }

    public async UpdateRefreshToken(id: string, refreshToken: string): Promise<void> {
        const res = await this.user.getModel().updateOne({_id: id}, {$set: {refreshToken: refreshToken}});

        if(!res.acknowledged) {
            throw new DataNotUpdated("update refresh token failed");
        }
    }

    public async UpdateLastLogin(id: string): Promise<void> {
        const res = await this.user.getModel().updateOne({_id: id}, {$set: {lastLogin: new Date()}});

        if(!res.acknowledged) {
            throw new DataNotUpdated("update last login failed");
        }

        if(res.matchedCount === 0) {
            throw new DataNotFound("user not found");
        }
    }

    public async UpdateLastLogout(id: string): Promise<void> {
        const res = await this.user.getModel().updateOne({_id: id}, {$set: {lastLogout: new Date()}});

        if(!res.acknowledged) {
            throw new DataNotUpdated("update last logout failed");
        }

        if(res.matchedCount === 0) {
            throw new DataNotFound("user not found");
        }
    }
}