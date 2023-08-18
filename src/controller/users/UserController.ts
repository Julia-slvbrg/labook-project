import { Request, Response } from "express";
import { UserBusiness } from "../../business/users/UserBusiness";
import { BaseError } from "../../errors/BaseError";
import { GetUsersSchema } from "../../dtos/user/getUsers.dto";
import { SignupSchema } from "../../dtos/user/signup.dto";
import { LoginSchema } from "../../dtos/user/login.dto";
import { ZodError } from "zod";

export class UserController{
    constructor(
        private userBusiness: UserBusiness
    ){}

    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = GetUsersSchema.parse({
                q: req.query.q,
                token: req.headers.authorization
            });

            const output = await this.userBusiness.getUsers(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public signUp = async (req: Request, res: Response) => {
        try {
            const input = SignupSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            const result = await this.userBusiness.signUp(input);

            res.status(201).send(result)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const input = LoginSchema.parse({
                email: req.body.email, 
                password: req.body.email
            });

            const output = await this.userBusiness.login(input);
            
            res.status(201).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

   
}