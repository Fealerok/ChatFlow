import React, { useState } from 'react'
import InputForm from '@/app/_ui/Input'
import Image from 'next/image'
import login_icon from "../../../public/avatar-login.png"
import padlock_icon from "../../../public/padlock-icon.png"
import eye_icon from "../../../public/eye-icon.png"

const RegistrationForm = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [isShowPassword, setIsShowPassword] = useState(true);
  return (
    <div className='w-full h-full flex flex-col gap-[30px] justify-between'>
        <div className="flex flex-col">
             <div className="w-full flex-col">
            <span className='text-[20px]'>Логин</span>
            <div className="flex w-full h-[60px] items-center gap-[10px]">
                <Image src={login_icon} alt='login' width={20} height={20} />
                <InputForm placeholder='Введите логин' isPassword={false} getInputValue={setLogin} />
            </div>
        </div>
        <div className="w-full flex-col">
            <span className='text-[20px]'>Пароль</span>
            <div className="flex w-full h-[60px] items-center gap-[10px]">
                <Image src={padlock_icon} alt='login' width={20} height={20} />
                <InputForm placeholder='Введите пароль' isPassword={isShowPassword} getInputValue={setPassword} />
                <button className='w-[20px] h-[20px] cursor-pointer' onClick={() => setIsShowPassword(!isShowPassword)}>
                    <Image src={eye_icon} alt='password' width={20} height={20} />
                </button>
            </div>
        </div>
        <div className="w-full flex-col">
            <span className='text-[20px]'>Подтверждение пароля</span>
            <div className="flex w-full h-[60px] items-center gap-[10px]">
                <Image src={padlock_icon} alt='login' width={20} height={20} />
                <InputForm placeholder='Введите пароль для подтверждения' isPassword={isShowPassword} getInputValue={setPassword} />
            </div>
        </div>
        </div>
       
        <div className="w-full h-[60px] rounded-[10px] overflow-hidden">
            <button className='w-full h-full bg-[image:var(--main-gradient)] text-white text-[20px]'>Зарегистрироваться в системе</button>
        </div>
    </div>
  )
}

export default RegistrationForm