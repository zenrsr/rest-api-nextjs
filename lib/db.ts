import mongoose from "mongoose";

const mongoDbUrl = process.env.MONGODB_URL;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState == 1) {
    console.log("Connection already established");
  }
  if (connectionState == 2) {
    console.log("Connecting...");
  }
  try {
    await mongoose.connect(mongoDbUrl!, {
      dbName: "rest-api-nextjs",
      bufferCommands: true
    });
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB");
    throw new Error(error);
  }
};

export default connect;
