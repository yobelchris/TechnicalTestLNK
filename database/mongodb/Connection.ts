import mongoose from "mongoose";

export class Connection {
    public static Connect(): mongoose.Connection {
        let uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

        if(process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
            uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
        }

        return mongoose.createConnection(uri, {maxPoolSize: process.env.MONGO_POOL_SIZE ? parseInt(process.env.MONGO_POOL_SIZE) : 10, dbName: process.env.MONGO_DATABASE});
    }
}