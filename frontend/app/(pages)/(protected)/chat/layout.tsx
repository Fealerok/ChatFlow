"use client"
import React, { useState } from 'react'
import chat_icon_gradient from "../../../../public/chat-icon-gradient.png"
import Image from 'next/image'
import InputForm from '@/app/_ui/Input'
import search_icon from "../../../../public/search-icon.png"
import UserDialog from '@/app/_components/chat/user-dialog'

const categories = [
    {id: 1, name: "Все чаты"},
    {id: 2, name: "Непрочитанные"}
]

const ChatLayout = ({
    children
} : {children: React.ReactNode}) => {

    const [searchValue, setSearchValue] = useState("");
    const [selectedButtonId, setSelectedButtonId] = useState(categories[0].id);

    

  return (
    <div className='w-full h-full'>
        <div className="flex flex-col w-[400px] h-full border p-[20px] justify-between">
            <header className='flex items-center gap-[15px]'>
                <Image src={chat_icon_gradient} alt='icon' width={48} height={48} />
                <span className='font-bold text-[24px]'>ChatFlow</span>
            </header>
            {/* Поиск */}
            <div className="w-full h-[60px] flex items-center gap-[30px] mt-[60px]" >
                <Image src={search_icon} alt='search' width={24} height={24}/>
                <InputForm placeholder='Поиск пользователя...' isPassword={false} getInputValue={setSearchValue} />
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
                    <UserDialog login='Fealer' lastMessage='Привет!' />
                    <UserDialog login='Fealer' lastMessage='Привет!'/>
                    

                </div>
             </div>
        </div>
        <div className="">
            {children}
        </div>
    </div>
  )
}

export default ChatLayout