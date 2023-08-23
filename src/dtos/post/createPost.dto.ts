import { z } from "zod"

export interface CreatePostInputDTO {
    content: string,
    token: string
};

export interface CreatePostOutputDTO {
    content: string
};

export const CreatePostSchema = z.object({
    content: z.string(
        {
            required_error: 'Create your post.',
            invalid_type_error: '"Content" must be a string'
        }
    ).min(
        1,
        '"Content" must have atleast one character.'
    ),
    token: z.string().min(1)
}).transform(data => data as CreatePostInputDTO)