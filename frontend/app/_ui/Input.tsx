import React, { useState } from 'react'

const InputForm = ({
    placeholder,
    isPassword,
    getInputValue
} : {
    placeholder: string,
    isPassword: boolean,
    getInputValue: (t: string) => void
}) => {

    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

  return (
    <form className='w-full h-full'>
        <input placeholder={placeholder} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className={`text-[20px] w-full h-full outline-none border-none' ${isFocused ? "text-black" : "text-gray-700"}`} type={isPassword ? "password" : "text"} onChange={(e) => setInputValue(e.target.value)} />
    </form>
  )
}

export default InputForm