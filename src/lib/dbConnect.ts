import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log(" Already connected to the database");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = conn.connections[0].readyState;

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" Database connection failed:", error);
    throw new Error("Database connection failed");
  }
};

export default dbConnect ;
