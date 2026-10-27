"use client"
import { createContext, useContext, useState } from "react";

interface IUser {
    login: string,
    role: string
}

interface IMainContext{
    user: IUser | null,
    setUser: (u: IUser | null) => void,
    accessToken: string | null,
    setAccessToken: (token: string) => void
}

const MainContext = createContext<IMainContext | null>(null);

export const MainContextProvider = ({children}:{children: React.ReactNode}) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);


    return (
        <MainContext.Provider value={{user, setUser, accessToken, setAccessToken}}>{children}</MainContext.Provider>
    )
}

export const useMainContext = () => {
    const context = useContext(MainContext);

    if (!context){
        throw new Error("Неверное использование контекста");
    }

    return context;
}