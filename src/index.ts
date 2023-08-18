import express from "express";
import cors from "cors";
import { userRouter } from "./router/userRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
    console.log(`Server running on port ${3003}.`)
});

//USERS
app.use('/users', userRouter)

//POSTS
