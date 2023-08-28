import { Request, Response } from "express";
import { PostBusiness } from "../../business/posts/PostBusiness";
import { BaseError } from "../../errors/BaseError";
import { CreatePostSchema } from "../../dtos/post/createPost.dto";
import { ZodError } from "zod";
import { GetPostSchema } from "../../dtos/post/getPost.dto";
import { UpdatePostSchema } from "../../dtos/post/updatePost.dto";
import { DeletePostSchema } from "../../dtos/post/deletePost.dto";
import { LikeDislikePostSchema } from "../../dtos/post/likeDislikePost.dto";

export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}

    public createPost = async (req:Request, res:Response) => {
        try {
            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            });

            const output = await this.postBusiness.createPost(input);
            
            res.status(200).send(output);

        } catch (error:any) {
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

    public getPost = async (req:Request, res:Response) => {
        try {
            const input = GetPostSchema.parse({
                token: req.headers.authorization
            });

            const output = await this.postBusiness.getPost(input);

            res.status(200).send(output)
            
        } catch (error:any) {
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

    public updatePost = async (req:Request, res:Response) => {
        try {
            const input = UpdatePostSchema.parse({
                id: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            });

            const output = await this.postBusiness.updatePost(input);

            res.status(200).send(output)
        } catch (error:any) {
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

    public deletePost = async (req:Request, res:Response) => {
        try {
            const input = DeletePostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization
            });

            await this.postBusiness.deletePost(input);
            
            res.status(200).send()
        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public likeDislikePost = async (req:Request, res:Response) => {
        try {
            const input = LikeDislikePostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            });

            await this.postBusiness.likeDislikePost(input);

            res.status(200).send();
        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    }
}


