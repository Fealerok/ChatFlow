import express, {type Request, type Response} from "express"
import { database } from "../database/database.js";
import bcrypt from "bcrypt"
import { AppError } from "../errors/AppError.js";
import { createAccessToken, createRefreshToken } from "../jwt/jwt.js";

const router = express();
const db = database.getInstance();
const salt = 5;

router.post("/auth", async (req: Request, res: Response) => {
    try {
        const {login, password} = req.body;

        const result = await db.auth(login, password);

        const accessToken = createAccessToken(result);
        const refreshToken = createRefreshToken(result);

        await db.setRefreshToken(login, refreshToken);

        return res.status(200).json({
            message: "Успешная авторизация.",
            user: result,
            accessToken: accessToken
        });
    } catch (error) {
        if (error instanceof AppError){
            return res.status(error.status).json({
                message: error.message
            });
        }

        else{
            console.log(error);

            return res.status(500).json({
                message: "Серверная ошибка авторизации."
            });
        }
    }
});

router.post("/registration", async (req: Request, res: Response) => {
    try {
        const {login, password} = req.body;
        const passwordHash = await bcrypt.hash(password, salt);

        await db.registration(login, passwordHash);

        return res.status(200).json({
            message: "Успешная регистрация."
        });

    } catch (error) {

        if (error instanceof AppError){
            return res.status(error.status).json({
                message: error.message
            });
        }

        else{
            console.log(error);
            return res.status(500).json({
                message: "Серверная ошибка регистрации."
            });
        }
    }
});

export default router;