import { GetPostByIdDB, GetPostDB, Post, PostDB } from "../../models/Post"
import { BaseDatabase } from "../BaseDatabase"

export class PostDatabase extends BaseDatabase{
    TABLE_NAME = 'posts'

    
    public async createPost(newPost:PostDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME).insert(newPost)
    };

    public async getPost():Promise<GetPostDB[]>{
        const post: GetPostDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .select(
                'posts.id', 
                'posts.content', 
                'posts.likes', 
                'posts.dislikes', 
                'posts.created_at as createdAt',
                'posts.updated_at as updatedAt',
                'posts.creator_id as creatorId',
                'users.name as creatorName'
            )
            .innerJoin('users', 'users.id', '=', 'posts.creator_id');
        
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