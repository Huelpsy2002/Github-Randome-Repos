import React ,{useState} from "react";
import DropDown from "./dropDown";
import RepoContainer from "./repoContainer";



function Main(){
    const [language ,setLang] = useState("Select A Language")
    
    return <main> 
    <DropDown language = {language} setLang = {setLang} />
    <RepoContainer setLang = {setLang}   language = {language!="Select A Language"?language:null} />
    </main> 
   
}


export default Main