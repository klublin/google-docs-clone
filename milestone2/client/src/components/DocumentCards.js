import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DocumentCards(props){
    const nav = useNavigate();
    function handleRemove(){
        props.removeDoc();
    }
    function handleClick(){
        nav('/edit/'+ props.documentId);
    }
    return (
        <div
            onClick={handleClick}
        >
            {props.index + 1}
            {props.name}
            <input
                type="button"
                id={"remove-document"}
                value={"X"}
                onClick={handleRemove}
            />
        </div>
    )
}