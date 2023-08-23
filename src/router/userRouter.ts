import express from "express";
import { UserController } from "../controller/users/UserController";
import { UserBusiness } from "../business/users/UserBusiness";
import { UserDatabase } from "../database/users/UserDatabase";
import { IdGenerator } from "../services/idGenerator";
import { TokenManager } from "../services/tokenManager";

export const userRouter = express.Router();

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
);

userRouter.get('/', userController.getUsers);
userRouter.post('/signup', userController.signUp);
userRouter.post('/login', userController.login)