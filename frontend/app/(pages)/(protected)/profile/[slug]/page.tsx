"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthFetch } from "@/app/_utils/useAuthFetch";
import user_avatar from "../../../../../public/avatar.png";
import Image, { StaticImageData } from "next/image";
import { useMainContext } from "@/app/_context/MainContext";
import edit_icon from "../../../../../public/profile/edit-icon.png";
import c_sharp_icon from "../../../../../public/profile/c_sharp.png";
import c_plus_icon from "../../../../../public/profile/c_plus.png";
import css_icon from "../../../../../public/profile/css.png";
import react_icon from "../../../../../public/profile/react.png";
import python_icon from "../../../../../public/profile/python.png";
import js_icon from "../../../../../public/profile/js.png";
import accept_edit_icon from "../../../../../public/profile/accept.png";


const backgroundsSkills = [
  "bg-white",
  "bg-red-500",
  "bg-orange-500",
  "bg-green-500"
]

const Profile = () => {
  const params = useParams<{ slug: string }>();
  const context = useMainContext();
  const router = useRouter();
  const authFetch = useAuthFetch();

  const [isOnline, setIsOnline] = useState(true);
  const [isEditSkills, setIsEditSkills] = useState(false);
  const [isEditBio, setIsEditBio] = useState(false);
  const [userBio, setUserBio] = useState("");
  const [userSkills, setUserSkills] = useState<
    Array<{
      name: string,
      level: number,
      image: StaticImageData,
    }>
  >([
     { name: "C#", level: 0, image: c_sharp_icon},
  { name: "C++", level: 0, image: c_plus_icon},
  { name: "CSS", level: 0, image: css_icon},
  { name: "React", level: 0, image: react_icon},
  { name: "Python", level: 0, image: python_icon},
  { name: "Javascript", level: 0, image: js_icon}
  ]);


  const editBio = () => {
    if (params.slug === context.user?.login) {
      setIsEditBio(true);
    }
  };

  const saveBio = async () => {
    const result = await authFetch("/save-user-bio", {
      method: "POST",
      body: JSON.stringify({userBio, login: context.user?.login})
    });
    setIsEditBio(false);
  };

  const getUserSkills = async () => {
    const result = await authFetch("/get-user-skills", {
      method: "POST",
      body: JSON.stringify({
        login: params.slug,
      }),
    });


    if (result.ok){
      const skills = (await result.json()).skills;

      console.log(skills);
      const skillsKeys = Object.keys(skills);
      
      skillsKeys.map((sk, i) => {
        setUserSkills((prev) => 
          prev.map((s, i) => s.name === sk ? {...s, level: skills[sk]} : s)
        )
      })

    }

  };


  

  const saveSkills = async () => {

    if (isEditSkills){
      const changedSkills = userSkills.map((s) => ({name: s.name, level: s.level}))

      const result = await authFetch("/save-user-skills", {
        method: "POST",
        body: JSON.stringify({skills: changedSkills, login: context.user?.login})
      });

    }
    setIsEditSkills((prev) => !prev)
  }

  const incrementSkill = (skillName: string) => {
    setUserSkills((prev) => 
       
        prev.map((s) => s.name === skillName ? {...s, level: s.level+1} : s)
    )
  }

  const decrementSkill = (skillName: string) => {
    setUserSkills((prev) => 
        prev.map((s) => s.name === skillName ? {...s, level: s.level-1} : s)
    )
  }

  const goToDialog = () => {
    router.replace(`/chat/${params.slug}`);
  }

  useEffect(() => {
    if (context.isLoading) return;

    if (!context.user || !context.accessToken) {
      console.log(context.user);
      router.replace("/auth");
    }
  }, [context.isLoading, context.user, context.accessToken]);

  useEffect(() => {
    console.log(userSkills);
  }, [userSkills]);

  useEffect(() => {
    const getProfileInformation = async () => {
    
     const result = await authFetch("/get-profile-information", {
      method: "POST",
      body: JSON.stringify({
        login: params.slug,
      }),
    });

    if (result.ok){
      const data = (await result.json()).data;

      const skills = data.skills;
      const bio = data.bio;
      const skillsKeys = Object.keys(skills);

      skillsKeys.map((sk, i) => {
        setUserSkills((prev) => 
          prev.map((s, i) => s.name === sk ? {...s, level: skills[sk]} : s)
        )
      })

      setUserBio(bio);
    }
  }

  getProfileInformation();

  }, []);


  return (
    <div className="w-full h-full flex justify-center">
      <div className="h-full w-[70%] flex flex-col items-center">
        <div className="w-full flex items-center">
          <div className="flex w-full border items-center">
            <div className="w-[120px] h-[120px] border flex items-center">
              <Image src={user_avatar} alt={""} />
            </div>
            <div className="flex flex-col justify-between w-full h-full items-start pl-[30px]">
              <div className="flex items-center w-full gap-[15px] ">
                <span className="text-[30px] font-semibold">{params.slug}</span>
                <div className="flex items-center gap-[8px]">
                  <div
                    className={`rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} w-[15px] h-[15px]`}
                  ></div>
                  <span

                    className={`${isOnline ? "text-green-500" : "text-red-500"} text-[15px] font-bold`}
                  >
                    {isOnline ? "Онлайн" : "Оффлайн"}
                  </span>
                </div>
              </div>

              {/* Описание */}
              <div className="h-full w-[30%] flex items-center">
                <textarea
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                  wrap="hard"
                  onFocus={editBio}
                  onBlur={saveBio}
                  name="bio"
                  id="bio"
                  className={`w-full h-full resize-none outline-none border-none text-gray-500 scrollbar-none hover:${params.slug === context.user?.login && !isEditBio ? "cursor-pointer" : "cursor-default"} ${isEditBio ? "cursor-text" : "cursor-default"}`}
                  readOnly={!isEditBio ? true : false}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex w-full h-full justify-end items-center">
            <button onClick={goToDialog} className="cursor-pointer border h-[60px] w-[250px] bg-[image:var(--main-gradient)] text-white text-[20px] rounded-[15px]">Написать сообщение</button>
          </div>
        </div>

        {/* Скиллы */}
        <div className="w-full h-full mt-[60px] flex flex-col justify-between">
          <div className="w-full h-[60px] flex items-center justify-between">
            <span className="text-[30px] font-bold">Навыки пользователя:</span>
            <button
              className={`w-[60px] h-full cursor-pointer flex items-center justify-center ${params.slug === context.user?.login ? "block" : "hidden"}`}
              onClick={saveSkills}
            >
              <Image
                src={!isEditSkills ? edit_icon : accept_edit_icon}
                alt=""
                className="w-[50%]"
              />
            </button>
          </div>

          <div className="w-full h-full grid grid-cols-3 grid-rows-2 mt-[60px]">
            {userSkills.map((skill, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center group"
              >
                <div className="flex flex-col items-center gap-[10px] min-h-[70%]">
                  <Image src={skill.image} alt="" className="w-[100px]" />
                  <span className="text-[20px] font-bold">{skill.name}</span>
                </div>

                <div className="w-full h-[30px] flex items-center gap-[15px]">
                  <button
                  onClick={() => decrementSkill(skill.name)}
                  disabled={skill.level <= 0 ? true : false}
                    className={`${isEditSkills ? "opacity-0 group-hover:opacity-100" : "opacity-0"} ${params.slug === context.user?.login ? "block" : "hidden"} transition-opacity duration-200 w-[40px] h-full flex items-center justify-center cursor-pointer bg-[image:var(--main-gradient)] rounded-[15px]`}
                  >
                    <div className="w-[50%] h-[2px] rounded bg-white"></div>
                  </button>
                  <div className="flex items-center justify-between w-full h-full gap-[5px]">
                    <div className={`w-full h-[10px] rounded border ${skill.level >= 1 && backgroundsSkills[skill.level]} transition-all duration-200`}></div>
                    <div className={`w-full h-[10px] rounded border ${skill.level >= 2 && backgroundsSkills[skill.level]} transition-all duration-200`}></div>
                    <div className={`w-full h-[10px] rounded border ${skill.level >= 3 && backgroundsSkills[skill.level]} transition-all duration-200`}></div>
                  </div>
                  <button
                  onClick={() => incrementSkill(skill.name)}
                  disabled={skill.level >= 3 ? true : false}
                    className={`${isEditSkills ? "opacity-0 group-hover:opacity-100" : "opacity-0"} ${params.slug === context.user?.login ? "block" : "hidden"} transition-opacity duration-200 w-[40px] h-full flex items-center justify-center cursor-pointer relative bg-[image:var(--main-gradient)] rounded-[15px]`}
                  >
                    <div className="w-[50%] h-[2px] rounded bg-white"></div>
                    <div className="w-[50%] h-[2px] rounded bg-white absolute rotate-[90deg]"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
