import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/redis.js";
import env from "./config/env.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`API server running on port ${env.port}`);
  });
};

startServer();
