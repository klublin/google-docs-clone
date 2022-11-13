import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';


export default function LoginScreen(){
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    function handleSubmit(){
        console.log("i'm still firing");
        let data ={
            user: user,
            password: password
        };
        fetch("http://localhost:3001/users/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.JSON())
        .then((data) => {
            console.log(data);
            if(!data.error){
                nav("/home");
            }
            else{
                setUser("");
                setPassword("");
            }
        })
        .catch(error => console.log(error));
    }

    return (
        <div id="login-form">
            <div>
            <label>
            Email:
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
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <input type="button" value = "submit" onClick={handleSubmit}/>
            </div>
        </div>
    )
}