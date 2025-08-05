import app from "./app.js";
import "dotenv/config";
import connectToMongoDB from "./config/db.config.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    connectToMongoDB();

    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
}

startServer();



