import express from "express";
import { PostController } from "../controller/posts/PostController";
import { PostBusiness } from "../business/posts/PostBusiness";
import { PostDatabase } from "../database/posts/PostDatabase";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";

export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
);

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getPost);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost)
