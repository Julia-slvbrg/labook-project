import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from "../errors/BaseError";

export class UserController{
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            const userBusiness = new UserBusiness();
            const output = await userBusiness.getUsers(q);

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

    public createUser = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            };

            const userBusiness = new UserBusiness();
            const result = await userBusiness.createUser(input);

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

    public updateUser = async (req:Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            };

            const userBusiness = new UserBusiness();
            const result = await userBusiness.upadateUser(input);

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

    public deleteUserById =async (req:Request, res: Response) => {
        try {
            const id = req.params.id as string;

            const userBusiness = new UserBusiness();
            const result = await userBusiness.deleteUserById(id);

            res.status(201).send(result)
        } catch (error) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    }
}   