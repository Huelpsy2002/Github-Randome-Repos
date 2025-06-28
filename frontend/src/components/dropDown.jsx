import React ,{useState}from "react";
import languages from "../index"


function DropDown(props){
    const [isListVisible,SetisListVisible] = useState(false)
    const {language,setLang} = props

    function openCloseList(){
        SetisListVisible(!isListVisible)
    }
    function setLanguage(lang){
        setLang(lang)
        SetisListVisible(!isListVisible)
    }
    return <div className="DropDownContainer">
        <div onClick={openCloseList} className="DropDownInput">
            <p >{language}</p> 
            <span>{isListVisible ? "▲": "▼"}</span>
        </div>
        <div style={{display:isListVisible?"flex":"none"}} className="DropDownList">
            <ul>
                {languages.map((lang,index)=>(
                    <li onClick={()=>setLanguage(lang)} className="DropDownInput" key={index}>{lang}</li>
                ))}
            </ul>
        </div>
        
    </div>
}


export default  DropDown