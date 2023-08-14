import { PostController } from "../../controller/posts/PostController";
import { PostDatabase } from "../../database/posts/PostDatabase";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase
    ){}
}