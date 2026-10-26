import React, { useEffect, useState } from 'react'
import { text } from 'stream/consumers'

interface IInformationWindow{
  isOpened: boolean,
  setIsOpened: (isOpened: boolean) => void,
  textInformationWindow: string
}

const InformationWindow = ({
  isOpened,
  setIsOpened,
  textInformationWindow
} : IInformationWindow ) => {

  useEffect(() => {
    console.log(textInformationWindow);
  }, [textInformationWindow]);


  return (
    <div className={`${isOpened ? "block" : "hidden"} flex flex-col items-center justify-center w-[600px] h-[400px] bg-[white] absolute left-1/2 right-0 top-1/2 bottom-0 z-1000 translate-x-[-50%] translate-y-[-50%] shadow-[10px_10px_25px_gray] rounded-[20px] border-gray-100 border-1`}>
        <div className="w-[90%] h-[80%] flex flex-col items-center justify-between">
          <span className='font-bold text-[30px]'>Информационное окно</span>
          <span className='text-center text-[20px] text-gray-500'>{textInformationWindow}</span>
          <button onClick={() => setIsOpened(false)} className='text-white cursor-pointer text-[20px] w-full h-[60px] bg-[image:var(--main-gradient)] rounded-[10px]'>Закрыть</button>
        </div>
        

    </div>
  )
}

export default InformationWindow