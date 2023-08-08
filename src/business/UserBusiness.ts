import { UserDatabase } from "../database/UserDatabase"
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { USER_ROLES, UserDB } from "../types";

export class UserBusiness{
    public getUsers = async (q:string|undefined):Promise<User[]> => {
        const userDatase = new UserDatabase();
        const usersDB = await userDatase.findUsers(q);

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

    public createUser = async (input:any):Promise<any> => {
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

        const userDatase = new UserDatabase();
        
        const checkUserId = await userDatase.findUserById(id);
        console.log(checkUserId)
        const checkUserEmail = await userDatase.findEmail(email);
        
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

        const newUserDB: UserDB ={
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            user_role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        };

        await userDatase.createUser(newUserDB);

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

    public upadateUser = async (input:any):Promise<any> => {
        const {id, name, email, password, role} = input;

      
        if(id[0] !== 'u'){
            throw new BadRequestError('"id" must start with the letter "u".')
        };
       
        if(name){
            if(typeof name !== 'string' || name.length<0 || name === " "){
                throw new BadRequestError('"name" must be a string.')
            };
        };

        if(email){
            if(!email.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")){
                throw new BadRequestError('Email invalid. Try again.')
            }
        };

        if(password){
            if(!password.match(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,10}$/g)){
                throw new BadRequestError('Password invalid. It must have from six to ten characters, with uppercase and lowercase letters and one special character. Try again.')
            }
        };

        if(role){
            if(
                role !== USER_ROLES.NORMAL &&
                role !== USER_ROLES.ADMIN
            ){
                throw new BadRequestError('Inform if the user role is "NORMAL" or "ADMIN".')
            }
        };

        const userDatase = new UserDatabase();

        const checkUserId = await userDatase.findUserById(id);
        const checkUserEmail  = await userDatase.findEmail(email);

        if(!checkUserId){
            throw new NotFoundError('The "id" is not registered.')
        };
        console.log(checkUserId)
        if(email){
            if(checkUserId.email !== checkUserEmail.email){
                throw new BadRequestError('The email is already registered.')
            }
        };
        
        const editedUser: User = new User(
            id,
            name || checkUserId.name,
            email || checkUserId.email,
            password || checkUserId.password,
            role || checkUserId.user_role,
            checkUserId.created_at
        );

        const userToDB = {
            id: editedUser.getId(),
            name: editedUser.getName(),
            email: editedUser.getEmail(),
            password: editedUser.getPassword(),
            user_role: editedUser.getRole(),
            created_at: editedUser.getCreatedAt()
        };

        await userDatase.updateUser(userToDB);

        const output = {
            message: 'User info updated',
            user: {
                id: userToDB.id,
                name: userToDB.name,
                email: userToDB.email,
                role: userToDB.user_role,
                createdAt: userToDB.created_at
            }
        };

        return output
    };

    public deleteUserById = async (id:string):Promise<any> => {
        
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

        const userDatabase = new UserDatabase();

        const checkUserId = await userDatabase.findUserById(id);

        if(!checkUserId){
            throw new NotFoundError('"id" not found.')
        };

        await userDatabase.deleteUser(id);

        const output = {
            message: 'User deleted',
            user: {
                id: id,
                name: checkUserId.name,
                email: checkUserId.email,
                role: checkUserId.user_role
            }
        };

        return output
    }
}
