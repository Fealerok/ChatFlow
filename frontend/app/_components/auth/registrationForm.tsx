import React, { useState } from 'react'
import InputForm from '@/app/_ui/Input'
import Image from 'next/image'
import login_icon from "../../../public/avatar-login.png"
import padlock_icon from "../../../public/padlock-icon.png"
import eye_icon from "../../../public/eye-icon.png"
import InformationWindow from '@/app/_ui/InformationWindow'
import isValidPassword from '@/app/_utils/validation'

interface IRegistrationForm{
    setIsOpenedWindow: (isOpened: boolean) => void,
    setTextInformationWindow: (text: string) => void
}

const RegistrationForm = ({setIsOpenedWindow, setTextInformationWindow}:IRegistrationForm) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isShowPassword, setIsShowPassword] = useState(true);

    const registration = async () => {
          if (login.trim().length == 0){
            setTextInformationWindow("Для авторизации введите логин");
            setIsOpenedWindow(true);
            return;
        }

        if (password.trim().length == 0){
            setTextInformationWindow("Для авторизации введите пароль");
            setIsOpenedWindow(true);
            return;
        }

        const validation = isValidPassword(password);

        if (!validation.isValid){
            setTextInformationWindow(validation.message);
            setIsOpenedWindow(true);
            return;
        }

        if (confirmPassword.trim().length == 0 || confirmPassword.trim() != password.trim()){
            setTextInformationWindow("Подтверждающий пароль должен совпадать с основным.");
            setIsOpenedWindow(true);
            return;
        }

        const result = await fetch("http://localhost:3010/registration", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                login,
                password
            })
        });

        if (!result.ok){
            const errorMessage = (await result.json()).message;

            setTextInformationWindow(errorMessage);
            setIsOpenedWindow(true);
            return;
        }

        setTextInformationWindow((await result.json()).message);
        setIsOpenedWindow(true);
    }

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
                <InputForm placeholder='Введите пароль для подтверждения' isPassword={true} getInputValue={setConfirmPassword} />
            </div>
        </div>
        </div>
       
        <div className="w-full h-[60px] rounded-[10px] overflow-hidden">
            <button onClick={registration} className='w-full h-full cursor-pointer bg-[image:var(--main-gradient)] text-white text-[20px]'>Зарегистрироваться в системе</button>
        </div>
    </div>
  )
}

export default RegistrationForm