import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';


export default function LoginScreen(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    function handleSubmit(){
        let data ={
            email: email,
            password: password
        };
        fetch("http://plzwork.cse356.compas.cs.stonybrook.edu:3001/users/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            if(!data.error){
                nav("/home");
            }
            else{
                setEmail("");
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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