import { Request, Response } from "express";
import { UserBusiness } from "../../business/users/UserBusiness";
import { BaseError } from "../../errors/BaseError";

export class UserController{
    constructor(
        private userBusiness: UserBusiness
    ){}

    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            const output = await this.userBusiness.getUsers(q);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public signUp = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            };

            const result = await this.userBusiness.signUp(input);

            res.status(201).send(result)
        } catch (error) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const input = {
                email: req.body.email, 
                password: req.body.email
            };

            res.status(201).send()
        } catch (error) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

   
}