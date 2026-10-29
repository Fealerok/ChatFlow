import { useMainContext } from "../_context/MainContext";


export const useAuthFetch = () => {
    
    const context = useMainContext();
    const baseUrl = "http://localhost:3010";

    return async (url: string, options: RequestInit) => {

        let result = await fetch(`${baseUrl}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${context.accessToken}`
            },
            body: options.body
        });

        if (!result.ok){
            const chechAuth = await fetch(`${baseUrl}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                credentials: "include"
            });

            if (!chechAuth.ok){
                throw new Error("Ошибка авторизации");
            }

            const data = await chechAuth.json();

            context.setAccessToken(data.accessToken);
            context.setUser(data.user);

            result = await fetch(`${baseUrl}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${context.accessToken}`
            },
            body: options.body
        });
        }

        return result;
    }

    
    
}