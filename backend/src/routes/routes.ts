import  jwt, { type VerifyErrors }  from 'jsonwebtoken';
import express, {type Request, type Response} from "express"
import { database } from "../database/database.js";
import bcrypt from "bcrypt"
import { AppError } from "../errors/AppError.js";
import { createAccessToken, createRefreshToken } from "../jwt/jwt.js";
import { checkTokens } from '../middleware/middleware.js';

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

        res.cookie("refreshToken", refreshToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE === "production",
            path: "/auth/refresh"
        });

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

router.post("/auth/refresh", (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken){
        return res.status(401).json({
            message: "Необходима авторизация."
        });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, async (err: VerifyErrors | null, decoded: any) => {
        if (err || !decoded){
            return res.status(401).json({
                message: "Необходима авторизация."
            });
        }

        try {
            const refreshTokenDatabase = await db.getRefreshToken(decoded.login);

            if (refreshToken !== refreshTokenDatabase){
                return res.status(401).json({
                    message: "Необходима авторизация."
                });
            }

            const user = {
                login: decoded.login,
                role: decoded.role
            }

            const accessToken = createAccessToken(user);

            return res.status(200).json({
                message: "Успешная проверка",
                user: user,
                accessToken: accessToken
            });
        } catch (error) {
            return res.status(401).json({
                message: "Необходима авторизация."
            });
        }
        
    });
    
});

router.post("/logout", async (req: Request, res: Response) => {
    const {login} = req.body;

    try {
        await db.logout(login);

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Пользователь разлогинился"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ошибка запроса на сервере."
        });
    }
});

router.post("/test", checkTokens, (req: Request, res: Response) => {
    return res.status(200).json({});
});

export default router;