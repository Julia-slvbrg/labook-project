import { EditedPostDB, PostDB } from "../../models/Post"
import { BaseDatabase } from "../BaseDatabase"

export class PostDatabase extends BaseDatabase{
    TABLE_NAME = 'posts'

    public async getPost(){}

    public async createPost(newPost:PostDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME).insert(newPost)
    };

    public async editPost(editedPost:EditedPostDB, creatorId: string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update(editedPost)
            .where({id: editedPost.id})
            .andWhere({creator_id: creatorId})
    };

    public async deletePost(id:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .where({id})
    }
}