import { PostDatabase } from "../../database/posts/PostDatabase";
import { EditedPostDB, Post } from "../../models/Post";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase
    ){}

    public createPost = async (input:any) => {
        const { content, /* token */ } = input;

        //const id = /* gerador de id  */;
        //const creatorId = /* pegar o id do autor do token */;

       /*  const newPost = new Post(  
            id,
            creatorId,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
        );

        await this.postDatabase.createPost(newPost.postToDBModel()) */
    };

    public getPost = async (input:any) => {
        
    };

    /* public updatePost = async (input:any) => {
        const { id, content, token } = input;

        const editedPost:EditedPostDB = {
            id,
            content,
            updated_at: new Date().toISOString()
        };

        await this.postDatabase.editPost(editedPost)
    }; */
}