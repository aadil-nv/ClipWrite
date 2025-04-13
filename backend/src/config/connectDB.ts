import mongoose, { Mongoose } from 'mongoose';
import 'colors';

export let dbInstance: Mongoose;

export const connectDB = async (): Promise<void> => {
    try {        
        if (process.env.MONGODB_URL) {
            dbInstance = await mongoose.connect(process.env.MONGODB_URL);
            console.log(`Database connected successfully!`.bgYellow.bold);
        } else {
            throw new Error("MONGODB_URL not defined");
        }
    } catch (error) {
        console.error("DB connection failed: ".red + error);
        process.exit(1); 
    }
};

