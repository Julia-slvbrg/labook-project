import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User";

export class UserBusiness{
    public getUsers = async (q:string|undefined) => {
        const userDatase = new UserDatabase();
        const usersDB = await userDatase.findUsers(q);

        const users: User[] = usersDB.map((userDB)=> new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        ));

        return users
    };
    
}
