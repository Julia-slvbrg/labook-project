import express from "express";
import { PostController } from "../controller/posts/PostController";
import { PostBusiness } from "../business/posts/PostBusiness";
import { PostDatabase } from "../database/posts/PostDatabase";

export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase()
    )
)