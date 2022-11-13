import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';



export default function RegisterScreen(){

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const nav = useNavigate();

    function handleSubmit (){
        let data = {
            user: user,
            password: password,
            email: email
        }
        fetch("http://localhost:3001/users/signup", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then((data) =>{
            if(!data.error){
                nav("/");
            }
            else{
                setUser("");
                setEmail("");
                setPassword("");
            }
        })
    }
    return (
        <div id="register-form">
            <form 
                onSubmit={handleSubmit}
            >
            <label>
            Username:
                <input 
                    type="text" 
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
            </label>
            <label>
            Password:
                <input 
                    type="text" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                </label>
            <label>
            Email:
                <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <input type="submit" value = "submit"/>
            </form> 
        </div>
    )
}