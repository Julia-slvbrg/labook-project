import { Request, Response } from "express";
import { PostBusiness } from "../../business/posts/PostBusiness";
import { BaseError } from "../../errors/BaseError";

export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}

    public createPost = async (req:Request, res:Response) => {
        try {
            const input = {
                content: req.body.content,
                //token
            };

            await this.postBusiness.createPost(input);
            
            res.status(200).send()
        } catch (error:any) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public getPost = async (req:Request, res:Response) => {
        try {
            
        } catch (error:any) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public updatePost = async (req:Request, res:Response) => {
        try {
            const input = {
                id: req.params.id,
                content: req.body.content,
                toke: req
            };

            //await this.postBusiness.updatePost(input);

            res.status(200).send()
        } catch (error:any) {
            console.log(error);

            if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    }
}