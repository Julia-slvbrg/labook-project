export class LikesDislikes{
    constructor(
        private userId: string,
        private postId: string,
        private like: number
    ){};

    public getUserId():string{
        return this.userId
    };
    public getPostId():string{
        return this.postId
    };
    public getLike():number{
        return this.like
    };
    public setLike(like:number){
        this.like = like
    }

    public likeDisliketoDBModel():LikesDislikesDB{
        return{
            user_id: this.userId,
            post_id: this.postId,
            like: this.like
        }
    }
};

export interface LikesDislikesDB{
    user_id: string,
    post_id: string,
    like: number
};

export interface LikeDislikeCountDB{
    newLikeCount: number,
    newDislikeCount: number
}

