import express from "express";
import { UserController } from "../controller/users/UserController";
import { UserBusiness } from "../business/users/UserBusiness";
import { UserDatabase } from "../database/users/UserDatabase";

export const userRouter = express.Router();

const userController = new UserController(
    new UserBusiness(
        new UserDatabase()
    )
);

userRouter.get('/', userController.getUsers);
userRouter.post('/signup', userController.signUp);
userRouter.put('/login', userController.login)