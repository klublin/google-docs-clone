import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import QuillCursors from 'quill-cursors';

//THINK WHY NOT CHANGE B/C IT IS NOT CORRECT TYPE
export default function TextEditor() {
    let [ doc, setDoc ] = useState();
    let [cursor, setCursor] = useState();   
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
        Quill.register('modules/cursors', QuillCursors);    
        const ydoc = new Y.Doc()
        setDoc(ydoc);
        const ytext = ydoc.getText('quill') 
        const d = new Quill(editor, {theme: "snow", modules: {cursors: true, toolbar: TOOLBAR_OPTIONS}});

        new QuillBinding(ytext, d);
        ydoc.on('update', update => {
            fetch(`http://plzwork.cse356.compas.cs.stonybrook.edu:3001/api/op/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Array.from(update))
            });
        })
        const c = d.getModule('cursors');
        setCursor(c);
        d.on('selection-change', function(range, oldRange, source) {
            if(range!=oldRange){
                fetch(`http://plzwork.cse356.compas.cs.stonybrook.edu:3001/api/presence/${id}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(range)
                })
            }
        })
    },[])
    useEffect(()=>{
        if(doc === undefined ){
            return;
        }
        const events = new EventSource(`http://plzwork.cse356.compas.cs.stonybrook.edu:3001/api/connect/${id}`, {withCredentials: true})
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
        events.addEventListener('presence', (event) => {
            let obj = JSON.parse(event.data);
            cursor.createCursor('cursor'+obj.session_id, obj.session_id, 'red');
            cursor.moveCursor('cursor' + obj.session_id, obj.cursor);
            cursor.update();
        })
    },[doc])

    return <div id = "container" ref={wrapperRef}></div>
}