"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import chat_icon_gradient from "../../../public/chat-icon-gradient.png"
import { useMainContext } from '@/app/_context/MainContext';
import { useRouter } from 'next/navigation';
import { useAuthFetch } from '@/app/_utils/useAuthFetch';
import { useState } from 'react'
import user_avatar from "../../../public/avatar-login.png"
import profile_arrow from "../../../public/profile-arrow.png"
import to_profile_icon from "../../../public/user-burger-menu.png"
import logout_icon from "../../../public/logout-icon.png"



const ProtectedLayout = ({children}:{children: React.ReactNode}) => {
    const context = useMainContext();
    const router = useRouter();
    const authFetch = useAuthFetch();

    const[isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);

    const [isOpenedWindow, setIsOpenedWindow] = useState(false);
    const [textModalWindow, setTextModalWindow] = useState("");
    
        const logoHandler = () => {
            router.replace("/chat");
        }

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
            router.replace(`/profile/${context.user?.login}`);
        }
  return (
    <div className='w-full h-full flex flex-col items-center'>
        <header className='flex justify-between items-center h-[60px] mt-[20px] mb-[20px] w-[calc(100%-40px)]'>
                <div className="flex items-center gap-[15px] w-full h-full hover:cursor-pointer" onClick={logoHandler}>
                    <Image src={chat_icon_gradient} alt='icon' width={48} height={48} />
                    <span className='font-bold text-[24px]'>ChatFlow</span>
                </div>
                <div onClick={() => setIsOpenBurgerMenu(!isOpenBurgerMenu)} className="w-full h-full flex justify-end">
                    <div className="h-full flex items-center gap-[15px] cursor-pointer">
                        <Image src={user_avatar} alt='' />
                        <Image src={profile_arrow} alt='' className={`${!isOpenBurgerMenu ? "rotate-[0deg]" : "rotate-[180deg]"} transition-transform duration-200 h-[10px] w-[10px]`} />
                    </div>
                </div>
                

                <div className={`w-[300px] absolute z-100 right-[20px] top-[80px] p-[10px] flex flex-col gap-[20px] ${isOpenBurgerMenu ? "block" : "hidden"}`}>
                    <div className="w-full flex items-center gap-[10px]">
                        <Image src={user_avatar} alt='' />
                        <span className='text-[20px]'>{context.user?.login}</span>
                    </div>
                    <button onClick={toProfile} className='group cursor-pointer hover:bg-[image:var(--main-gradient)] w-full h-[60px] text-black hover:text-white rounded-[10px] text-[20px] flex items-center gap-[10px]'>
                        <Image src={to_profile_icon} alt='' width={30} className='group-hover:invert' />
                        <span>Перейти в профиль</span>
                    </button>
                    <button onClick={logout} className='group hover:bg-[image:var(--main-gradient)] text-black hover:text-white w-full h-[60px] rounded-[10px] text-[20px] cursor-pointer flex items-center gap-[10px]'>
                         <Image src={logout_icon} alt='' width={25} className='group-hover:invert ml-[4px]' />
                        <span>Выход</span>
                    </button>
                </div>
        </header>

        {children}
    </div>
  )
}

export default ProtectedLayout