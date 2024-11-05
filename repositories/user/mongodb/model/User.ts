import {Schema, Document, Connection, Model} from "mongoose";
import CoreUser from "../../../../cores/user/dto/UserDTO";
import bcrypt from "bcrypt";

interface IUserModel extends Document{
    username: string;
    password: string;
    lastLogin: Date;
    lastLogout: Date;
    refreshToken: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUserModel>({
    username: {
        type: String,
        unique: true
    },
    password: String,
    refreshToken: String,
    lastLogin: Date,
    lastLogout: Date
},{
    timestamps: true
});

export default class User {
    private readonly model: Model<IUserModel>;

    constructor(conn: Connection, isSeeding: boolean = false) {
        this.model = conn.model<IUserModel>("User", UserSchema);

        if(isSeeding) {
            this.Seed().catch((err: any) => {
                console.error("ERROR SEEDING USER : ", err);
            });
        }
    }

    public async Seed(): Promise<void> {
        const user = await this.model.findOne({username: "admin"});
        if(!user) {
            const userToInsert = new this.model({username: "admin"});
            userToInsert.password = await bcrypt.hash("admin", 10);

            await userToInsert.save();
        }
    }

    public getModel(): Model<IUserModel> {
        return this.model;
    }

    public ToCore(user: IUserModel): CoreUser {
        return new CoreUser(user.id, user.username, user.password, user.refreshToken, user.lastLogin, user.lastLogout, user.createdAt, user.updatedAt);
    }

    public FromCore(user: CoreUser): IUserModel {
        return new this.model({
            username: user.username,
            password: user.password,
            refreshToken: user.refreshToken,
            lastLogin: user.lastLogin,
            lastLogout: user.lastLogout,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
}