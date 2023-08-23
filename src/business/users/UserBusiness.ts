import { UserDatabase } from "../../database/users/UserDatabase"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../../dtos/user/getUsers.dto";
import { LoginOutputDTO } from "../../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../../dtos/user/signup.dto";
import { BadRequestError } from "../../errors/BadRequestError";
import { USER_ROLES, User } from "../../models/User";
import { IdGenerator } from "../../services/idGenerator";
import { TokenManager, TokenPayload } from "../../services/tokenManager";

export class UserBusiness{
    constructor(
        private userDatabase:  UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getUsers = async (input:GetUsersInputDTO):Promise<GetUsersOutputDTO[]> =>{ 
        const { q, token } = input;

        const usersDB = await this.userDatabase.findUsers(q);

        const users: GetUsersOutputDTO[] = usersDB.map((userDB)=> {
            return{
                id: userDB.id,
                name: userDB.name,
                email: userDB.email,
                role: userDB.user_role,
                createdAt: userDB.created_at
            }
        });

        return users
    };

    public signUp = async (input:SignupInputDTO):Promise<SignupOutputDTO> => {
        const {name, email, password} = input;
        
        const checkUserEmail = await this.userDatabase.findEmail(email);
       
        if(checkUserEmail){
            throw new BadRequestError('The "email" is already being used.')
        };

        const newUser = new User(
            this.idGenerator.generateId(),
            name,
            email,
            password,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        );

        await this.userDatabase.createUser(newUser.userToDBModel());

        const token = this.tokenManager.createToken(
            {
                id: newUser.getId(),
                role: newUser.getRole(),
                name: newUser.getName()
            }
        );

        const output: SignupOutputDTO = {
            message: 'User registered',
            token: token
        };

        return output
    };

    public login = async (input:any):Promise<LoginOutputDTO> => {
        const {email, password} = input;

        const checkUser = await this.userDatabase.findEmail(email);

        if(!checkUser){
            throw new BadRequestError('User not registerd.')
        };

        if(password !== checkUser.password){
            throw new BadRequestError('Incorrect "email" or "password".')
        };

        const payload:TokenPayload = {
            id: checkUser.id,
            role: checkUser.user_role,
            name: checkUser.name
        };

        const token = this.tokenManager.createToken(payload);

        const output: LoginOutputDTO = {
            message: 'User successfully loged.',
            token: token
        };

        return output
    }

}
