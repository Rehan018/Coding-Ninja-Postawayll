import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.db_url;
console.log("url: " + url);
let client;
export const connectDB = async () => {
    try {
        client = await MongoClient.connect(url);
        console.log("Mongodb is connected");
        createCounter(client.db());
        createIndexes(client.db());
    } catch (err) {
        console.log("Error while connecting to db");
        console.log(err);
    }
}
