import IRepository from "../repository/IUserRepository";
import UserDTO from "../dto/UserDTO";
import bcrypt from 'bcrypt';
import {UserAuthError} from "../../../libs/errors/AuthError";

export interface IUserUsecase {
    Login(username: string, password: string): Promise<UserDTO>
    GetUserById(id: string): Promise<UserDTO>
    UpdateRefreshToken(id: string, refreshToken: string): Promise<void>
    Logout(id: string): Promise<void>
}

export default class UserUsecase implements IUserUsecase {
    private readonly repository: IRepository;

    constructor(repository: IRepository) {
        this.repository = repository;
    }

    public async Login(username: string, password: string): Promise<UserDTO> {
        const user = await this.repository.GetUserByUsername(username);

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            throw new UserAuthError("password not match");
        }

        await this.repository.UpdateLastLogin(user.id);

        return user;
    }

    public async GetUserById(id: string): Promise<UserDTO> {
        return await this.repository.GetUserById(id);
    }

    public async UpdateRefreshToken(id: string, refreshToken: string): Promise<void> {
        return await this.repository.UpdateRefreshToken(id, refreshToken);
    }

    public async Logout(id: string): Promise<void> {
        return await this.repository.UpdateLastLogout(id);
    }
}