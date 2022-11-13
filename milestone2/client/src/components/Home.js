import React, {useState} from 'react'
import DocumentCards from './DocumentCards.js'

export default function Home(){
    let [list, setList] = useState();

    function loadList(){
        fetch(`http://localhost:3001/collection/list`, {
            method: 'GET'
        })
        .then( res => res.json())
        .then( data => {
            setList(data);
        })
    }
    if(list === null){
        loadList();
    }
    function createDocument(){

    }
    function handleRemove(event){
        fetch("http://localhost:3001/collection/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event.target.id)
        })
    }
    let documents="";
    if(list){
        documents = list.map((pair, index) => {
            return <DocumentCards
                id={pair.id}
                name={pair.name}
                index={index}
                removeDoc={handleRemove}
            />
        })
    }
    return(
        <div id="document-list-header">
            <input
                type="button"
                id={"add-document"}
                value={"+"}
                onClick={createDocument}
            />
            <input 
                type="button"
                id={"logout-button"}
                value={"logout"}
                onClick={"handleLogout"}
            />
            <div id="document-list">
            {documents}
            </div>
        </div>
        

    )
}