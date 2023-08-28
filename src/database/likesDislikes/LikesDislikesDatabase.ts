import { LikesDislikesDB } from "../../models/LikesDislikes";
import { BaseDatabase } from "../BaseDatabase";

export class LikesDislikesDatabase extends BaseDatabase{
    TABLE_NAME = 'likes_dislikes'

    public async getLike(userId:string, postId:string):Promise<LikesDislikesDB[]>{
        const likeDislike: LikesDislikesDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .where({user_id: userId})
            .andWhere({post_id: postId})
        
        return likeDislike
    };

    public async createPost(newLikeDislike:LikesDislikesDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newLikeDislike)

        console.log('criando novo post na like_dislike');
    }

    public async deletePost(userId:string, postId:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .del()
            .where({user_id: userId})
            .andWhere({post_id: postId})

        console.log('post excluído da tabela likes_dislikes');
    };

    public async editPost(postId:string, editedLikeDislike:number){
        await BaseDatabase.connection(this.TABLE_NAME)
            .update({like: editedLikeDislike})
            .where({post_id: postId})
        
        console.log('edit post tabela like_dislike');
            
    }
}