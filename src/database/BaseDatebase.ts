import knex, { Knex } from "knex";

export abstract class BaseDatabase{
    protected static connection: Knex;

    constructor(){
        if(!BaseDatabase.connection){
            BaseDatabase.connection= knex({
                client: 'sqlite3',
                connection:{
                    filename: './src/database/labook.db',
                },
                useNullAsDefault: true,
                pool:{
                    min: 0,
                    max: 1,
                        afterCreate: (conn: any, cb: any) => {
                            conn.run("PRAGMA foreign_keys = ON", cb)
                        }
                }
            })
        }
    }

    abstract TABLE_NAME: string;
}