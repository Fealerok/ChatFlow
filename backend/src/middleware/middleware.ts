import { type Request, type Response, type NextFunction } from "express"
import jwt, { type VerifyErrors } from "jsonwebtoken"

export const checkTokens = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken){
        return res.status(403).json({
            message: "Отсутствует Access Token"
        });
    }

    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string, (err: VerifyErrors | null, decoded: any) => {
        if (err){
            return res.status(403).json({
                message: "Недействительный Access Token"
            });
        }

        next();
    });
}