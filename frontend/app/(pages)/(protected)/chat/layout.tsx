"use client"
import React, { useEffect, useState } from 'react'
import chat_icon_gradient from "../../../../public/chat-icon-gradient.png"
import Image from 'next/image'
import InputForm from '@/app/_ui/Input'
import search_icon from "../../../../public/search-icon.png"
import UserDialog from '@/app/_components/chat/user-dialog'
import { useMainContext } from '@/app/_context/MainContext'
import { useRouter } from 'next/navigation'
import InformationWindow from '@/app/_ui/InformationWindow'
import { useAuthFetch } from '@/app/_utils/useAuthFetch'

const categories = [
    {id: 1, name: "Все чаты"},
    {id: 2, name: "Непрочитанные"}
]

const ChatLayout = ({
    children
} : {children: React.ReactNode}) => {

    const [searchValue, setSearchValue] = useState("");
    const [selectedButtonId, setSelectedButtonId] = useState(categories[0].id);
    const [isOpenedWindow, setIsOpenedWindow] = useState(false);
    const [textModalWindow, setTextModalWindow] = useState("");
    const [conversations, setConversations] = useState<Array<{
        id: number,
        userALogin: string,
        userBLogin: string,
        last_message_at: Date
    }>>([]);

    const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);
    
    const context = useMainContext();
    const router = useRouter();
    const authFetch = useAuthFetch();

    const openConversation = async (loginChat: string) => {
        setSelectedUserChat(loginChat);

        const result = await authFetch("/get-name-chat", {
            method: "POST",
            body: JSON.stringify({
                mainLogin: context.user?.login,
                conversationLogin: loginChat
            })
        });

        if (result.ok){
            const chatName = (await result.json()).chatName;

            context.setSelectedChat(chatName);
            router.replace(`/chat/${loginChat}`);
        }
    }

    

    useEffect(() => {
        if (context.isLoading) return;

        if (!context.accessToken || !context.user){
            router.replace("/auth");
        }
    }, [context.isLoading, context.accessToken, context.user]);

    useEffect(() => {

        const getConversations = async () => {
            if (context.isLoading) return

            const result = await authFetch("/get-conversations", {
                method: "POST",
                body: JSON.stringify({login: context.user?.login})
            });

            if (result.ok){
                const data = await result.json();

                setConversations(data.conversations);
            }
        }

        getConversations();

        if (!context.selectedChat) router.replace("/chat");

    }, [context.isLoading]);




    return(
        <div className='w-full h-full relative flex'>
        <div className="flex flex-col w-[400px] h-full p-[20px] justify-between">
            {/* Поиск */}
            <div className="w-full h-[60px] flex items-center gap-[30px]" >
                <Image src={search_icon} alt='search' width={24} height={24}/>
                <InputForm placeholder='Поиск диалога...' isPassword={false} getInputValue={setSearchValue} />
            </div>

             {/*Диалоги  */}
             <div className="w-full h-full min-h-0 mt-[10px] flex flex-col justify-between">
                {/* Кнопки выбора категории сообщений */}
                <div className="w-full h-[60px] flex justify-between border-red-300">
                    {categories.map((c, i) => (
                        <button key={i} onClick={() => setSelectedButtonId(c.id)} className={`text-[20px] w-[150px] cursor-pointer relative hover:before:opacity-100 before:content-[''] before:w-full before:absolute before:top-full before:left-0 before:bg-[#2563EB] before:h-[4px] before:rounded-b-[20px] before:transition-opacity before:duration-200 ${c.id === selectedButtonId ? "before:opacity-100" : "before:opacity-0"}`}>{c.name}</button>
                    ))}
                    </div>  
                <div className="w-full h-full mt-[30px] flex  flex-col gap-[20px] overflow-y-auto">
                    {
                        conversations.map((c, i) => (
                            <UserDialog key={i} getUserChat={openConversation} login={c.userALogin === context.user?.login ? c.userBLogin : c.userALogin} lastMessage='' />
                        ))
                    }
                    
                    

                </div>
             </div>
        </div>
        <div className="">
            {children}
        </div>

        <InformationWindow isOpened={isOpenedWindow} textInformationWindow={textModalWindow} setIsOpened={setIsOpenedWindow} />
    </div>
    )
}

export default ChatLayout