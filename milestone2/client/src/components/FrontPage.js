import React, {useState} from 'react'
import RegisterScreen from './Register.js'
import LoginScreen from './Login.js'

export default function FrontPage(){
    const [register, setRegister] = useState(true);
    function handleClick(){
        setRegister(prev => !prev);
    }
    let component = register ? <RegisterScreen/> : <LoginScreen/>;
    let message = register ? "Have an account? Click here to login" : "Don't have an account? press here to login";
    let heading = register ? "REGISTER AN ACCOUNT" : "LOGIN";
    return(
        <div>
            {heading}
            {component}
            <input
                type={"button"}
                value={message}
                onClick={handleClick}
            />
        </div>
    )
}