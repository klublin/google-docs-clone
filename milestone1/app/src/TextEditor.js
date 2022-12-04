import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'

//THINK WHY NOT CHANGE B/C IT IS NOT CORRECT TYPE
export default function TextEditor() {
    let [ doc, setDoc ] = useState();

    let { id } = useParams();
    const TOOLBAR_OPTIONS = [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
    ]
    const wrapperRef = useCallback(wrapper =>{
        if(wrapper == null)return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        
        const ydoc = new Y.Doc()
        setDoc(ydoc);
        const ytext = ydoc.getText('quill') 
        const d = new Quill(editor, {theme: "snow", modules: {toolbar: TOOLBAR_OPTIONS}});

        new QuillBinding(ytext, d);
        ydoc.on('update', update => {
            console.log("a");
            fetch(`http://giveten.cse356.compas.cs.stonybrook.edu/api/op/${id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Array.from(update))
            });
        })
    },[])
    useEffect(()=>{
        if(doc === undefined ){
            return;
        }
        const events = new EventSource(`http://giveten.cse356.compas.cs.stonybrook.edu/api/connect/${id}`)
        events.addEventListener('sync', (event) =>{
            let obj = JSON.parse(event.data);
            obj = Uint8Array.from(obj);
            Y.applyUpdate(doc, obj);
        })
        events.addEventListener('update', (event) =>{
            let obj = JSON.parse(event.data);
            obj = Uint8Array.from(obj);  
            Y.applyUpdate(doc, obj);
        })
    },[doc])
    return <div id = "container" ref={wrapperRef}></div>
}