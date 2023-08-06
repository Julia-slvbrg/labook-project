import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";

export class UserController{
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined

            const userBusiness = new UserBusiness();
            const output = userBusiness.getUsers(q);

            res.status(200).send(output)
        } catch (error) {
            
        }
    }
}