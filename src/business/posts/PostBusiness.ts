import { PostDatabase } from "../../database/posts/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../../dtos/post/createPost.dto";
import { DeletePostInputDTO } from "../../dtos/post/deletePost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../../dtos/post/getPost.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../../dtos/post/updatePost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { GetPostByIdDB, Post } from "../../models/Post";
import { USER_ROLES } from "../../models/User";
import { IdGenerator } from "../../services/IdGenerator";
import { TokenManager } from "../../services/TokenManager";
import { LikeDislikePostInputDTO } from "../../dtos/post/likeDislikePost.dto";
import { LikesDislikesDatabase } from "../../database/likesDislikes/LikesDislikesDatabase";
import { LikeDislikeCountDB, LikesDislikes, LikesDislikesDB } from "../../models/LikesDislikes";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private likesDislikesDatabase: LikesDislikesDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public createPost = async (input:CreatePostInputDTO):Promise<CreatePostOutputDTO> => {
        const { content, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid token.')
        };

        const id = this.idGenerator.generateId();

        const newPost = new Post(  
            id, //postId
            payload.id, //creatorId
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
        );

        await this.postDatabase.createPost(newPost.postToDBModel())

        const output: CreatePostOutputDTO = {
            content
        };

        return output
    };

    public getPost = async (input:GetPostInputDTO):Promise<GetPostOutputDTO[]> => {
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('Invalid "token".')
        };

        const postsDB = await this.postDatabase.getPost();

        const result:GetPostOutputDTO[] = postsDB.map((postDB) => {
            return{
                id: postDB.id,
                content: postDB.content,
                likes: postDB.likes,
                dislikes: postDB.dislikes,
                createdAt: postDB.createdAt,
                updatedAt: postDB.updatedAt,
                creator: {
                    id: postDB.creatorId,
                    name: postDB.creatorName
                }

            }
        });
        

        return result
    };

    public updatePost = async (input:UpdatePostInputDTO):Promise<UpdatePostOutputDTO> => {
        const { id, content, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('"token" is required.')
        };

        const checkPostId = await this.postDatabase.getPostById(id);       

        if(!checkPostId){
            throw new NotFoundError('Post "id" not found')
        };


        if(payload.id !== checkPostId.creator_id){
            throw new BadRequestError('Only the creator of the post can edit it.')
        };        

        const editedPost = new Post(
            checkPostId.id,
            checkPostId.creator_id,
            checkPostId.content,
            checkPostId.likes,
            checkPostId.dislikes,
            checkPostId.created_at,
            new Date().toISOString()
        );

        editedPost.setContent(content);

        await this.postDatabase.editPost(editedPost.postToDBModel(), payload.id)
        
        const output = {
            content: content
        }

        return output
    };

    public deletePost = async (input:DeletePostInputDTO):Promise<void> => {
        const { id, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('"token" is required.')
        };

        const checkPostId = await this.postDatabase.getPostById(id);

        if(!checkPostId){
            throw new NotFoundError('Post "id" not found.')
        };

        if(payload.id !== checkPostId.creator_id && payload.role !== USER_ROLES.ADMIN){
            throw new BadRequestError('Only the creator of the post, or an ADMIN user, can delete it.')
        };

        await this.postDatabase.deletePost(id);
    };

    public likeDislikePost = async (input:LikeDislikePostInputDTO):Promise<void> => {
        const { id, token, like } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('"token" is required.')
        };

        const checkPostId = await this.postDatabase.getPostById(id);

        if(!checkPostId){
            throw new NotFoundError('Post not found.')
        };

        const [checkLikeDislike] = await this.likesDislikesDatabase.getLike(payload.id, id);

        if(!checkLikeDislike){

            console.log('criando a tabela')
            const newLikeDislike: LikesDislikesDB = {
                user_id: payload.id,
                post_id:id,
                like: like? 1 : 0
            };

            await this.likesDislikesDatabase.createPost(newLikeDislike);

            console.log('alterando a contagem')
            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: like? checkPostId.likes + 1 : checkPostId.likes,
                newDislikeCount: like? checkPostId.dislikes : checkPostId.dislikes + 1
            };

            await this.postDatabase.editLikes(checkPostId.id, newLikeDislikeCount)

            return
        };

        const likeDislikeDB = new LikesDislikes(
            checkLikeDislike.user_id,
            checkLikeDislike.post_id,
            checkLikeDislike.like
        );

        const postDB = await this.postDatabase.getPostById(likeDislikeDB.getPostId())
        
        if(checkLikeDislike.like === 1 && like){
            
            await this.likesDislikesDatabase.deletePost(likeDislikeDB.getUserId(), likeDislikeDB.getPostId());

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes - 1,
                newDislikeCount: postDB.dislikes
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 1 && !like){

            await this.likesDislikesDatabase.editPost(likeDislikeDB.getPostId(), 0);

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes - 1,
                newDislikeCount: postDB.dislikes + 1
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 0 && like){
            
            await this.likesDislikesDatabase.editPost(likeDislikeDB.getPostId(), 1);

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes + 1,
                newDislikeCount: postDB.dislikes - 1
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return

        };

        if(checkLikeDislike.like === 0 && !like){
          
            await this.likesDislikesDatabase.deletePost(likeDislikeDB.getUserId(), likeDislikeDB.getPostId());

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes,
                newDislikeCount: postDB.dislikes - 1
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        }
    }
}