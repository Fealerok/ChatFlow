"use client";

import React, { useEffect, useState } from "react";
import isValidPassword from "@/app/_utils/validation";
import chat_icon from "../../../public/chat-icon.png";
import Image from "next/image";
import AuthForm from "@/app/_components/auth/authForm";
import RegistrationForm from "@/app/_components/auth/registrationForm";
import InformationWindow from "@/app/_ui/InformationWindow";

const categories = [
    {id: 1, name: "auth"},
    {id: 2, name: "registration"}
]

const AuthPage = () => {

  const [isAuthForm, setIsAuthForm] = useState(true);
  const [selectedButtonId, setSelectedButtonid] = useState(categories[0].id);
  const [isOpenedInformationWindow, setIsOpenedInformationWindow] = useState(false)
  const [textInformationWindow, setTextInformationWindow] = useState("");

  useEffect(() => {
    console.log(textInformationWindow);
  }, [textInformationWindow]);

  return (
       <div className="flex w-full h-full items-center justify-between relative">
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
                {categories[selectedButtonId-1].name == "auth" ? "Добро пожаловать в ChatFlow" : "Создание аккаунта"}
            </span>
            <span className="text-gray-700">
                  {categories[selectedButtonId-1].name !== "registration" ? "Введите свои данные для авторизации" : "Введите свои данные для регистрации"}
              
            </span>
          </div>
          {/* Логин или авторизация */}
          <div className="flex gap-[30px] mt-[60px]">

            {
              categories.map((c, i) => (
                <button key={i} onClick={() => setSelectedButtonid(c.id)} className={`text-[20px] w-[150px] cursor-pointer relative hover:before:opacity-100 before:content-[''] before:w-full before:absolute before:top-full before:left-0 before:bg-[#2563EB] before:h-[4px] before:rounded-b-[20px] before:transition-opacity before:duration-200 ${c.id === selectedButtonId ? "before:opacity-100" : "before:opacity-0"}`}>
                  {c.name == "auth" ? "Авторизация" : "Регистрация"}
                </button>
              ))
            }
          </div>

          {/* Форма ввода */}
          <div className="w-full h-full mt-[20px]">
            {categories[selectedButtonId-1].name == "auth" ? <AuthForm setIsOpenedWindow={setIsOpenedInformationWindow} setTextInformationWindow={setTextInformationWindow} /> : <RegistrationForm />}
          </div>
        </div>
      </div>

      <InformationWindow isOpened={isOpenedInformationWindow} setIsOpened={setIsOpenedInformationWindow} textInformationWindow={textInformationWindow} />
    </div>
        

   
  );
};

export default AuthPage;
