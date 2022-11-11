import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function FrontPage(){
    const [id, setId] = useState("");
    const nav = useNavigate();
    function handleSubmit (event){
        nav(`/api/${id}`);
    }
    return(
        <div>
            <form onSubmit = {handleSubmit}>
                <label htmlFor="ID">ID:
                    <input 
                        type = "text"
                        value={id}
                        onChange={(e)=> setId(e.target.value)}
                    />
                </label>
            <input type="submit" value="submit"/>
            </form> 
        </div>
    )
}