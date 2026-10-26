import jwt from "jsonwebtoken"

interface IPayload{
    login: string,
    role: string
}

const createAccessToken = (payload: IPayload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: "1m"
    });

    return accessToken;
}

const createRefreshToken = (payload: IPayload) => {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: "5m"
    });

    return refreshToken;
}

