import React from "react";
import {useNavigate} from 'react-router-dom'
import FrontPage from './FrontPage.js'
import Home from './Home.js'

export default function HomeWrapper(){
    let nav = useNavigate();
    let renderLogin = true;
    fetch("http://kevwei.cse356.compas.cs.stonybrook.edu:3001/verify", {
        method: "POST",
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.success){
            renderLogin = false;
        }
    })

    if(renderLogin){
        return <FrontPage/>
    }
    else{
        return <Home/>
    }
}