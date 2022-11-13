import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DocumentCards(props){
    const nav = useNavigate();
    function handleRemove(event){
        event.stopPropagation();
        console.log(event);
        props.removeDoc(event);
    }
    function handleClick(){
        nav('/edit/'+ props.documentId);
    }
    return (
        <div
            id={"document-card "+props.documentId}
            className="document-card"
            onClick={handleClick}
        >
            {props.index + 1}.
            {props.name}
            <input
                type="button"
                className={"remove-document-button"}
                id={props.documentId}
                value={"X"}
                onClick={handleRemove}
            />
        </div>
    )
}