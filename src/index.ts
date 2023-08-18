import express from "express";
import cors from "cors";
import { userRouter } from "./router/userRouter";
import dotenv from "dotenv";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 3003, () => {
    console.log(`Server running on port ${process.env.PORT || 3003}.`)
});

//USERS
app.use('/users', userRouter)

//POSTS
