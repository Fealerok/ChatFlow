"use client"

import React from 'react'
import Image from 'next/image'
import chat_icon_gradient from "../../../public/chat-icon-gradient.png"
import { useMainContext } from '@/app/_context/MainContext';
import { useRouter } from 'next/navigation';
import { useAuthFetch } from '@/app/_utils/useAuthFetch';
import { useState } from 'react'
import user_avatar from "../../../public/avatar-login.png"
import profile_arrow from "../../../public/profile-arrow.png"



const ProtectedLayout = ({children}:{children: React.ReactNode}) => {
    const context = useMainContext();
    const router = useRouter();
    const authFetch = useAuthFetch();

    const[isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);

    const [isOpenedWindow, setIsOpenedWindow] = useState(false);
    const [textModalWindow, setTextModalWindow] = useState("");
        
        const logout = async () => {
             const result = await fetch("http://localhost:3010/logout", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    login: context.user?.login
                })
            });
    
            if (result.ok){
                context.setAccessToken(null);
                context.setUser(null);
                setIsOpenBurgerMenu(false);
            }
    
            else{
                setTextModalWindow((await result.json()).message);
                setIsOpenedWindow(true);
                return;
            }
        }

        const toProfile = () => {
            setIsOpenBurgerMenu(false);
        }
  return (
    <div className='w-full h-full flex flex-col items-center'>
        <header className='flex justify-between items-center h-[60px] mt-[20px] mb-[20px] w-[calc(100%-40px)]'>
                <div className="flex items-center gap-[15px] w-full h-full">
                    <Image src={chat_icon_gradient} alt='icon' width={48} height={48} />
                    <span className='font-bold text-[24px]'>ChatFlow</span>
                </div>
                <div onClick={() => setIsOpenBurgerMenu(!isOpenBurgerMenu)} className="w-full h-full flex justify-end">
                    <div className="h-full flex items-center gap-[15px] cursor-pointer">
                        <Image src={user_avatar} alt='' />
                        <Image src={profile_arrow} alt='' className={`${!isOpenBurgerMenu ? "rotate-[0deg]" : "rotate-[180deg]"} transition-transform duration-200 h-[10px] w-[10px]`} />
                    </div>
                </div>
                

                <div className={`w-[300px] border absolute z-100 right-[20px] top-[80px] p-[10px] flex flex-col gap-[20px] ${isOpenBurgerMenu ? "block" : "hidden"}`}>
                    <button onClick={toProfile} className='cursor-pointer bg-[image:var(--main-gradient)] w-full h-[60px] text-white rounded-[10px] text-[20px]'>Перейти в профиль</button>
                    <button onClick={logout} className='bg-[image:var(--main-gradient)] text-white w-full h-[60px] rounded-[10px] text-[20px] cursor-pointer'>Выход</button>
                </div>
        </header>

        {children}
    </div>
  )
}

export default ProtectedLayout