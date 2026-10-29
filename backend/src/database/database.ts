import  bcrypt  from 'bcrypt';
import knex from "knex"
import { AppError } from "../errors/AppError.js";

const config = {
    client: "pg",
    connection: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "1111",
        database: "ChatFlow"
    }
}

const dbConnection = knex(config);

class Database{
    
    static #db: Database;

    getInstance = () => {
        if (!Database.#db){
            Database.#db = new Database()
        }

        return Database.#db;
    }

    auth = async (login: string, password: string) => {
        
        const foundUser = await dbConnection("Users")
                                            .where({login: login})
                                            .select("*");
        if (foundUser.length == 0){
            throw new AppError("Пользователя с таким логином не существует.", 409)
        }

        const user = foundUser[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch){
            throw new AppError("Неверный пароль.", 401)
        }

        const role = (await dbConnection("Roles")
                                            .where({id: user.id_role})
                                            .select("name"));
        if (role.length == 0){
            throw new Error("Роли не существует.");
        }


        return {
            login: user.login,
            role: role[0].name
        }

    }

    setRefreshToken = async (login: string, refreshToken: string) => {
        try {
            await dbConnection("Users").where({login: login})
                                        .update({token: refreshToken});
        } catch (error) {
            throw new Error(`Ошибка установки RefreshToken в БД ${error}`);
        }
    }

    getRefreshToken = async (login: string) => {
        try {
            const refreshToken = await dbConnection("Users")
                                        .where({login: login})
                                        .select("token");
            if (refreshToken.length == 0){
                throw new Error("Токена нет в БД");
            }

            return refreshToken[0].token;
        } catch (error) {
            console.log(error);
        }
    }

    registration = async (login: string, passwordHash: string) => {
        


            const foundUser = await dbConnection("Users")
                                    .where({login: login})
                                    .select("id");
            
            if (foundUser.length > 0){
                throw new AppError("Пользователь с таким логином уже существует.", 409);
            }

            const idRole = ((await dbConnection("Roles")
                                .where({name: "Пользователь"})
                                .select("id"))[0]).id;
            try {
            await dbConnection("Users").insert({
                login: login,
                password_hash: passwordHash,
                skills: {
                    "C#": 0,
                    "C++": 0,
                    "Python": 0,
                    "Javascript": 0,
                    "CSS": 0,
                    "React": 0
                },
                id_role: idRole
            })

        } catch (error) {
            throw new Error(`Ошибка регистрации в БД ${error}`)
        }
    }

    logout = async (login: string) => {
        try {
            await dbConnection("Users").where({login: login})
                                .update({token: null});
        } catch (error) {
            throw new Error(`Ошибка logout в БД: ${error}`);
        }
    }
}

export const database = new Database();