import React, {useState} from 'react'
import DocumentCards from './DocumentCards.js'
import {useNavigate} from 'react-router-dom'

export default function Home(){
    let [list, setList] = useState();
    let [docName, setDocName] = useState("");
    const nav = useNavigate();
    function loadList(){
        fetch(`http://plzwork.cse356.compas.cs.stonybrook.edu:3001/collection/list`, {
            method: 'GET',
            credentials: 'include'
        })
        .then( res => res.json())
        .then( data => {
            setList(data);
        })
    }
    if(list === null || list === undefined){
        loadList();
    }
    function handleLogout(){
        fetch(`http://plzwork.cse356.compas.cs.stonybrook.edu:3001/collection/list`, {
            method: 'POST',
            credentials: 'include'
        })
        .then(console.log("logging out"));
        nav('/');
    }
    function createDocument(event){
        fetch(`http://plzwork.cse356.compas.cs.stonybrook.edu:3001/collection/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: docName})
        })
        .then((response) => response.json())
        .then(() => {
            loadList();
            setDocName("");
        });
    }
    function handleRemove(event){
        fetch("http://plzwork.cse356.compas.cs.stonybrook.edu:3001/collection/delete", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: event.target.id})
        }).then(()=>{
            console.log("i'm in here?");
            loadList();
        })
    }
    let documents="";
    if(list){
        console.log(list);
        documents = list.map((pair, index) => {
            return <DocumentCards
                key={pair.id}
                documentId={pair.id}
                name={pair.name}
                index={index}
                removeDoc={handleRemove}
            />
        })
    }
    return(
        <div id="document-list-header">
            <div>
            <label>
                New Document Name: 
            <input
                type="text"
                id={"add-document"}
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
            />
            </label>
            <input
                type="button"
                id="submit-new-doc-name"
                value="add"
                onClick={createDocument}
            />
            </div>
            <input 
                type="button"
                id={"logout-button"}
                value={"logout"}
                onClick={handleLogout}
            />
            <div id="document-list">
            {documents}
            </div>
        </div>
        

    )
}