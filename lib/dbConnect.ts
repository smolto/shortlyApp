import mongoose from "mongoose";

const connection: any = {};

const MONGO_DB_URL = process.env.MONGO_DB_URL ? process.env.MONGO_DB_URL : "";

const dbConnect = async () => {
  if (connection.isConnected) return;

  const db = await mongoose.connect(MONGO_DB_URL);

  connection.isConnected = db.connections[0].readyState;
};
export default dbConnect;
