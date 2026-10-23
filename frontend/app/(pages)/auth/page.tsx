"use client";

import React, { useEffect, useState } from "react";
import isValidPassword from "@/app/_utils/validation";
import chat_icon from "../../../public/chat-icon.png";
import Image from "next/image";
import AuthForm from "@/app/_components/auth/authForm";
import RegistrationForm from "@/app/_components/auth/registrationForm";

const AuthPage = () => {
  const [isAuthForm, setIsAuthForm] = useState(true);
  return (
    <div className="flex w-full h-full items-center justify-between">
      <div className="h-full w-[800px] bg-[image:var(--main-gradient)]">
        <div className="flex flex-col w-full h-full pl-[60px] pr-[30px]">
          <div className="flex text-white items-center gap-[30px] w-full mt-[60px]">
            <Image
              src={chat_icon}
              alt="icon"
              width={64}
              height={64}
              className="invert"
            />
            <span className="text-[38px] font-bold">ChatFlow</span>
          </div>

          <div className="w-full flex flex-col text-white text-[18px] font-normal mt-[60px]">
            <span className="text-[30px] font-bold mb-[20px] leading-[45px]">
              Подключайтесь без проблем
            </span>
            <span>Легкое, быстрое и защищенное общение</span>
            <span>для друзей и коллег</span>
          </div>

          {/* Тут изображение чата */}
          <div className="w-full"></div>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col w-[50%] h-[70%]">
          {/* Велком */}
          <div className="flex flex-col justify-between w-full">
            <span className="text-[38px] font-bold">
                {isAuthForm ? "Добро пожаловать в ChatFlow" : "Создание аккаунта"}
            </span>
            <span className="text-gray-700">
                  {isAuthForm ? "Введите свои данные для авторизации" : "Введите свои данные для регистрации"}
              
            </span>
          </div>
          {/* Логин или авторизация */}
          <div className="flex gap-[30px] mt-[60px]">
            <button
              className={`text-[20px] w-[150px] cursor-pointer relative hover:before:opacity-100 before:content-[''] before:w-full before:absolute before:top-full before:left-0 before:bg-[#2563EB] before:h-[4px] before:rounded-b-[20px] before:transition-opacity before:duration-200 ${isAuthForm ? "before:opacity-100" : "before:opacity-0"}`}
            onClick={() => setIsAuthForm(true)}
            >
              Авторизация
            </button>
            <button
              className={`text-[20px] w-[150px] cursor-pointer relative hover:before:opacity-100 before:content-[''] before:w-full before:absolute before:top-full before:left-0 before:bg-[#2563EB] before:h-[4px] before:rounded-b-[20px] before:transition-opacity before:duration-200 ${!isAuthForm ? "before:opacity-100" : "before:opacity-0"}`}
              onClick={() => setIsAuthForm(false)}
            >
              Регистрация
            </button>
          </div>

          {/* Форма ввода */}
          <div className="w-full h-full mt-[20px]">
            {isAuthForm ? <AuthForm /> : <RegistrationForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
