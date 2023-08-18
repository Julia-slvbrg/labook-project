export interface LikesDislikesDB{
    user_id: string,
    post_id: string,
    like: number
};

export enum USER_ROLES{
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN'
};

export interface TokenPayload{
    id: string,
    name: string,
    role: USER_ROLES
}