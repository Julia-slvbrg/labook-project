import { EditedPostDB, GetPostByIdDB, GetPostDB, PostDB } from "../../models/Post"
import { BaseDatabase } from "../BaseDatabase"

export class PostDatabase extends BaseDatabase{
    TABLE_NAME = 'posts'

    
    public async createPost(newPost:PostDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME).insert(newPost)
    };

    public async getPost():Promise<GetPostDB[]>{
        const post: GetPostDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .select('p.id', 'p.content', 'p.likes', 'p.dislikes', 'p.createdAt', 'p.updatedAt', 'p.creatorId', 'u.name as creatorName')
            .innerJoin('users as u', 'p.creator_id', 'u.id');
        
        return post
    };

    public async getPostById(id:string):Promise<GetPostByIdDB>{
        const [post]: GetPostByIdDB[] = await super.findById(id);

        return post
    }

    public async editPost(editedPost:PostDB, creatorId: string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update(editedPost)
            .where({id: editedPost.id})
            .andWhere({creator_id: creatorId})
    };

    public async deletePost(id:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
        .del()
        .where({id})
    }
}