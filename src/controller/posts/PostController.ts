import { PostBusiness } from "../../business/posts/PostBusiness";
import { PostDatabase } from "../../database/posts/PostDatabase";

export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}
}