export class LikesDislikes{
    constructor(
        private userId: string,
        private postId: string,
        private like: number
    ){};

    public getUserId():string{
        return this.userId
    };
    public setUserId(userId:string){
        this.userId = userId
    };
    public getPostId():string{
        return this.postId
    };
    public setPostId(postId:string){
        this.postId = postId
    };
    public getLike():number{
        return this.like
    };
    public setLike(like:number){
        this.like = like
    }
}