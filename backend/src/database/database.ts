import  bcrypt  from 'bcrypt';
import knex from "knex"
import { AppError } from "../errors/AppError.js";
import { join } from 'node:path';

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

    getProfileInformation = async (login: string) => {
         try {
            const data = ((await dbConnection("Users").where({login: login})
                                                        .select("skills", "bio")))[0];
            return data;
        } catch (error) {
            throw new Error(`Ошибка получения скиллов в БД: ${error}`);
        }
    }

    getUserSkills = async (login: string) => {
        try {
            const skills = ((await dbConnection("Users").where({login: login})
                                                        .select("skills"))[0]).skills;
            
            return skills;
        } catch (error) {
            throw new Error(`Ошибка получения скиллов в БД: ${error}`);
        }
    }

    saveUserSkills = async (login: string, skills: {[k: string]: any}) => {
        try {
            await dbConnection("Users").where({login: login})
                                        .update({skills: skills});
        } catch (error) {
            throw new Error(`Ошибка сохранения скиллов в БД: ${error}`);
        }
    }

    saveUserBio = async (userBio: string, login: string) => {
        try {
            await dbConnection("Users").where({login: login})
                                        .update({bio: userBio});
        } catch (error) {
            throw new Error(`Ошибка сохранения описания в БД: ${error}`);
        }
    }

    getConversations = async (login: string) => {
        try {
            const idUser = ((await dbConnection("Users")
                                .where({login: login})
                                .select("id"))[0]).id;
            const conversations = await dbConnection("Conversations")
                                        .where({id_userA: idUser})
                                        .orWhere({id_userB: idUser})
                                        .join("Users as userA", "Conversations.id_userA", "=", "userA.id")
                                        .join("Users as userB", "Conversations.id_userB", "=", "userB.id")
                                        .select("Conversations.id", "userA.login as userALogin", "userB.login as userBLogin", "last_message_at");
            return conversations;
        } catch (error) {
            throw new Error(`Ошибка получения бесед в БД: ${error}`);
        }
    }

    getChatName = async (mainLogin: string, conversationLogin: string) => {
        try {
            const mainUserId = ((await dbConnection("Users").where({login: mainLogin}).select("id"))[0]).id;
            const conversationUserId = ((await dbConnection("Users").where({login: conversationLogin}).select("id"))[0]).id;

            let chatName = "";
            let result = await dbConnection("Conversations").where({
                id_userA: mainUserId,
                id_userB: conversationUserId
            })
            .orWhere({
                id_userA: conversationUserId,
                id_userB: mainUserId
            }).select("*");

            if (result[0].id_userA === mainUserId){
                chatName = `${mainLogin}-${conversationLogin}`
            }
            else{
                chatName = `${conversationLogin}-${mainLogin}`
            }

            return chatName;
        } catch (error) {
            throw new Error(`Ошибка создания названия беседы в БД: ${error}`);
        }
    }
}

export const database = new Database();