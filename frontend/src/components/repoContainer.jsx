import React, { useState, useEffect } from "react";
import axios, { HttpStatusCode } from 'axios';
import { request } from "../index";

function RepoContainer(props) {
    const [state, setState] = useState("Please Select A Language")
    const [repoData, setRepoData] = useState({
        html_url: "",
        name: "",
        description: "",
        forks_count: "",
        open_issues_count: "",
        stargazers_count: ""
    })

    async function FetchData() {
        if (props.language == null) return
        setState("Loading,Please Wait")
        try {
            let config = {
                url: `/api/repositories/random?language=${props.language}`
            }
            let res = await axios(config)
            if (res.status != 200) {

                throw new Error(`Error Fetching Repostries`)
            }
            let repository = res.data.repository
            if (!repository || repository == undefined) {
                throw new Error("Error Fetching Repostries")

            }
            setState("done")


            let { html_url, name, description, forks_count, open_issues_count, stargazers_count } = repository
            setRepoData({ html_url, name, description, forks_count, open_issues_count, stargazers_count })


        }
        catch (err) {
            setState(err.message)

        }

    }
    useEffect(() => {
        FetchData()
    }, [props.language])




    return <>
        <div className="RepoContainer">
            {
                state !== "done" ?
                    <div><p>{state}</p></div>
                    :

                    <a href={repoData.html_url} target="_blank" >
                        <div className="Repo">

                            <p style={{ fontSize: "20px" }}>{repoData.name}</p>
                            <p id="description">{repoData.description}</p>
                            <div className="RepoData">
                                <p>{props.language}</p>
                                <p><i className="fas fa-star"></i> {repoData.stargazers_count}</p>
                                <p><i className="fas fa-code-branch"></i> {repoData.forks_count}</p>
                                <p> <i className="fas fa-exclamation-circle"></i> {repoData.open_issues_count}</p>


                            </div>


                        </div>
                    </a>
            }
        </div >
        <button
            style={state == "Error Fetching Repostries" ? { backgroundColor: "red" } : {}}
            className="Refresh"
            onClick={FetchData}
        >
            {state == "Error Fetching Repostries" ? "Try Again" : "Refresh"}
        </button>



    </>
}

export default RepoContainer
