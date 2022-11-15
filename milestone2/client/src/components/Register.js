import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';



export default function RegisterScreen(){

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const nav = useNavigate();

    function handleSubmit (){
        let data = {
            name: name,
            password: password,
            email: email
        }
        console.log("i did in fact try to post some stuff");
        fetch("http://plzwork.cse356.compas.cs.stonybrook.edu:3001/users/signup", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then((data) =>{
            if(!data.error){
                nav("/");
            }
            else{
                setName("");
                setEmail("");
                setPassword("");
            }
        })
    }
    return (
        <div id="register-form">
            <div>
            <label>
            name:
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
            <label>
            Email:
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <input type="button" value = "submit" onClick={handleSubmit}/>
            </div>
        </div>
    )
}