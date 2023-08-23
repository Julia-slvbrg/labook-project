import { PostDatabase } from "../../database/posts/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../../dtos/post/createPost.dto";
import { DeletePostInputDTO } from "../../dtos/post/deletePost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../../dtos/post/getPost.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../../dtos/post/updatePost.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { EditedPostDB, Post } from "../../models/Post";
import { USER_ROLES } from "../../models/User";
import { IdGenerator } from "../../services/idGenerator";
import { TokenManager } from "../../services/tokenManager";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
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


        if(payload.id !== checkPostId.creatorId){
            throw new BadRequestError('Only the creator of the post can edit it.')
        };

        const editedPost = new Post(
            checkPostId.id,
            checkPostId.creatorId,
            checkPostId.content,
            checkPostId.likes,
            checkPostId.dislikes,
            checkPostId.createdAt,
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

        if(payload.id !== checkPostId.creatorId || payload.role !== USER_ROLES.ADMIN){
            throw new BadRequestError('Only the creator of the post, or an ADMIN user, can delete it.')
        };

        await this.postDatabase.deletePost(id);
    }
}