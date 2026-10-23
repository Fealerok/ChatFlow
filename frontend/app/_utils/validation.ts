const isValidPassword = (password: string) => {

    const passwordWithoutSpaces = password.trim();

    if (passwordWithoutSpaces.length < 8){
        return {
            isValid: false,
            message: "Длина пароля должна быть не меньше 8 символов."
        }
    }

    if (!/\d/.test(passwordWithoutSpaces)){
        return {
            isValid: false,
            message: "В пароле должна присутствовать хотя бы одна цифра."
        } 
    }

    return {
        isValid: true,
        message: "Пароль подходит."
    }

}

export default isValidPassword;