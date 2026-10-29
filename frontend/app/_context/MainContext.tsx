"use client"
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client"

interface IUser {
    login: string,
    role: string
}

interface IMainContext{
    user: IUser | null,
    setUser: (u: IUser | null) => void,
    accessToken: string | null,
    setAccessToken: (token: string | null) => void,
    isLoading: boolean
}

const MainContext = createContext<IMainContext | null>(null);
const baseUrl = "http://localhost:3010"
const socket = io(baseUrl, {
    autoConnect: false
});

export const MainContextProvider = ({children}:{children: React.ReactNode}) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                 const result = await fetch(`${baseUrl}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                credentials: "include"
            });

            if (!result.ok){
                setUser(null);
                setAccessToken(null);
                return;
            }
            else{
                const data = await result.json();
                setAccessToken(data.accessToken);
                setUser(data.user);
            }
            } catch (error) {
                setUser(null);
                setAccessToken(null);
            }

            finally{
                setIsLoading(false);
            }
        })()
    }, []);

    useEffect(() => {
        console.log(user);
        console.log(accessToken);
    }, [user, accessToken]);


    return (
        <MainContext.Provider value={{user, setUser, accessToken, setAccessToken, isLoading}}>{children}</MainContext.Provider>
    )
}

export const useMainContext = () => {
    const context = useContext(MainContext);

    if (!context){
        throw new Error("Неверное использование контекста");
    }

    return context;
}