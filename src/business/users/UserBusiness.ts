import { UserDatabase } from "../../database/users/UserDatabase"
import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";
import { User, UserDB } from "../../models/User";
import { USER_ROLES} from "../../types";

export class UserBusiness{
    constructor(
        private userDatabase:  UserDatabase
    ){}

    public getUsers = async (q:string|undefined):Promise<User[]> =>{ 
        const usersDB = await this.userDatabase.findUsers(q);

        const users: User[] = usersDB.map((userDB)=> new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.user_role,
            userDB.created_at
        ));

        return users
    };

    public signUp = async (input:any):Promise<any> => {
        const {id, name, email, password, role} = input;

        if(id){
            if(typeof id !== 'string'){
                throw new BadRequestError('"id" must be a string.')
            };
            if(id[0] !== 'u'){
                throw new BadRequestError('"id" must start with the letter "u".')
            }
        }else{
            throw new BadRequestError('Inform user "id"')
        };

        if(name){
            if(typeof name !== 'string' || name.length<0 || name === " "){
                throw new BadRequestError('"name" must be a string.')
            };
        }else{
            throw new BadRequestError('Inform users "name"')
        };

        if(email){
            if(!email.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")){
                throw new BadRequestError('Email invalid. Try again.')
            }
        }else{
            throw new BadRequestError('Inform user "email"')
        };

        if(password){
            if(!password.match(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,10}$/g)){
                throw new BadRequestError('Password invalid. It must have from six to ten characters, with uppercase and lowercase letters and one special character. Try again.')
            }
        }else{
            throw new BadRequestError('Inform user "password"')
        };

        if(role){
            if(
                role !== USER_ROLES.NORMAL &&
                role !== USER_ROLES.ADMIN
            ){
                throw new BadRequestError('Inform if the user role is "NORMAL" or "ADMIN".')
            }
        }else{
            throw new BadRequestError('Inform the user role.')
        };
        
        const checkUserId = await this.userDatabase.findUserById(id);
        console.log(checkUserId)
        const checkUserEmail = await this.userDatabase.findEmail(email);
        
        if(checkUserId){
            throw new BadRequestError('The "id" is already being used.')
        };
       
        if(checkUserEmail){
            throw new BadRequestError('The "email" is already being used.')
        };

        const newUser = new User(
            id,
            name,
            email,
            password,
            role,
            new Date().toISOString()
        );

        await this.userDatabase.createUser(newUser.userToDBModel());

        const output = {
            message: 'User registered',
            user: {
                id: newUser.getId(),
                name: newUser.getName(),
                email: newUser.getEmail(),
                role: newUser.getRole(),
                createdAt: newUser.getCreatedAt()
            }
        };

        console.log(output)

        return output
    };

    public login = async (input:any):Promise<any> => {
        const {email, password} = input;

        const checkUserEmail = await this.userDatabase.findEmail(email);

        if(!checkUserEmail){
            throw new BadRequestError('User not registerd.')
        };
        //validação da senha

        //resto do código
    }

}
