import { UsersDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    TABLE_NAME = 'users'

    public async findUsers(q:string|undefined){
        let usersDB

        if(q){
            const result: UsersDB[] = await BaseDatabase
                .connection(this.TABLE_NAME)
                .where('name', 'LIKE', `%${q}%`);
            
            usersDB = result
        }else{
            const result: UsersDB[] = await super.findAll();

            usersDB = result
        };

        return usersDB
    };
}