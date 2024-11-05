import UserDTO from "../dto/UserDTO";

export default interface IUserRepository {
    GetUserByUsername(username: string): Promise<UserDTO>
    GetUserById(id: string): Promise<UserDTO>
    UpdateRefreshToken(id: string, refreshToken: string): Promise<void>
    UpdateLastLogin(id: string): Promise<void>
    UpdateLastLogout(id: string): Promise<void>
}