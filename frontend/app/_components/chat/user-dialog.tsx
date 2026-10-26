import React from 'react'
import user_avatar from "../../../public/avatar-login.png"
import Image from 'next/image'

const UserDialog = ({
    login,
    lastMessage
} : {
    login: string,
    lastMessage: string
}) => {
  return (
    <div className='w-full h-[60px] flex items-center justify-between'>
        <div className="flex items-center gap-[10px] w-full pr-[10px] h-full">
             <Image src={user_avatar} width={60} height={60} alt='' />
        {/* Ник и сообщение */}
        <div className="flex flex-col h-[80%] justify-between w-full">
            <span>{login}</span>
            <span>{lastMessage}</span>
        </div>
        </div>
        {/* Количество непрочитанных */}
        <div className="w-[60px] h-[80%] flex flex-col justify-end items-end">
            <div className="w-[25px] h-[25px] rounded-full bg-[var(--main-blue)] flex justify-center items-center text-white">5</div>
        </div>
    </div>
  )
}

export default UserDialog