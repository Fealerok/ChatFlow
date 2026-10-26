import knex, { Knex } from "knex"

const config: Knex.Config = {
    client: "pg",
    connection: {
        host: "localhost",
        port: 5423,
        user: "postgres",
        password: "1111",
        database: "ChatFlow"
    }
}

const dbConnection = knex(config);


class Database{
    
    db: Database | null = null;

    constructor(){
        if (!this.db){
            this.db = new Database();
        }

        return this.db;
    }

    


}