import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/database.js';

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
