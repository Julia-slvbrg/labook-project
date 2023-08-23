export class Post{
    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string
    ){};

    public getId():string{
        return this.id
    };
    public getCreatorId():string{
        return this.creatorId
    };
    public setCreatorId(creatorId:string){
        this.creatorId = creatorId
    };
    public getContent():string{
        return this.content
    };
    public setContent(content:string){
        this.content = content
    };
    public getLikes():number{
        return this.likes
    };
    public setLikes(likes:number){
        this.likes = likes
    };
    public getDislikes():number{
        return this.dislikes
    };
    public setDislikes(dislikes:number){
        this.dislikes = dislikes
    };
    public getCreatedAt():string{
        return this.createdAt
    };
    public setCreatedAt(createdAt:string){
        this.createdAt = createdAt
    };
    public getUpdatedAt():string{
        return this.updatedAt
    };
    public setUpdatedAt(updatedAt:string){
        this.updatedAt = updatedAt
    };

    public postToDBModel():PostDB{
        return{
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
};

export interface PostDB{
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
};

export interface EditedPostDB{
    id: string,
    content: string,
    updated_at: string
}

export interface GetPostDB{
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creatorId: string,
    creatorName: string
}

export interface GetPostByIdDB{
    id: string,
    creatorId: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string
}
