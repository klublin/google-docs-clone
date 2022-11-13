import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';


export default function LoginScreen(){
    const [user, setUser] = useState();
    const [password, setPassword] = useState();
    const nav = useNavigate();
    function handleSubmit(){
        let data ={
            user: user,
            password: password
        };
        fetch("http://localhost:3001/users/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.JSON())
        .then((data) => {
            if(!data.error){
                nav("/home");
            }
            else{
                setUser("");
                setPassword("");
            }
        });
    }

    return (
        <div id="login-form">
            <form 
                onSubmit={handleSubmit}
            >
            <label htmlFor="user">Username:
            <input 
                type="text" 
                id="username" 
                name="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                />
            </label>
            <label htmlFor="pass">Password:
            <input 
                type="text" 
                id="password" 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <input type="submit" value = "submit"/>
            </form> 
        </div>
    )
}