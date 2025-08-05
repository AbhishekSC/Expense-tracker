import mongoose from 'mongoose';
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;
async function connectToMongoDB(){
    try{
        await mongoose.connect(MONGODB_URI);
        console.info('Connected to MongoDB successfully');
    }
    catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectToMongoDB;