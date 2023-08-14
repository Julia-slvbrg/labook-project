import { UserDB } from "../../models/User";
import { BaseDatabase } from "../BaseDatabase";

export class UserDatabase extends BaseDatabase{
    TABLE_NAME = 'users'

    public async findUsers(q:string|undefined){
        let usersDB

        if(q){
            const result: UserDB[] = await BaseDatabase
                .connection(this.TABLE_NAME)
                .where('name', 'LIKE', `%${q}%`);
            
            usersDB = result
        }else{
            const result: UserDB[] = await super.findAll();

            usersDB = result
        };

        return usersDB
    };

    public async findUserById(id:string){
       let [userDB]: UserDB[] = await super.findById(id); //deixando assim, o retorno vai vir desestruturado. Vai ser só um objeto.

        return userDB
    };

    public async findEmail(email:string){
        const [userDB]: UserDB[] = await BaseDatabase
            .connection(this.TABLE_NAME)
            .where('email', 'LIKE', `${email}`)
        return userDB
    };

    public async createUser(newUser:UserDB){
        await BaseDatabase
            .connection(this.TABLE_NAME)
            .insert(newUser)
    };

    public async updateUser(userToDB:UserDB){
        await BaseDatabase
            .connection(this.TABLE_NAME)
            .update(userToDB)
            .where({id: userToDB.id})
    };

    public async deleteUser(id:string){
        await BaseDatabase
            .connection(this.TABLE_NAME)
            .del().where({id})
    }
}