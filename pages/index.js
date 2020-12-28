import React, {useState, useEffect} from 'react'
import * as localForage from "localforage"
import Preview from './components/preview'
import Offlinepreview from './components/offlinepreview'
import Navbar from './navbar'
import { LinearProgress } from '@material-ui/core'

export default function Home(){
    const [projectArray, setProjectArray] =  useState([])
    const [offlineArray, setOfflineArray] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)
    
    async function getProjects(){
        try {
            const res = await fetch("api/getProjects", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            })
    
            let data = await res.json()
            console.log("data: ", data)
            setProjectArray(data)
            localForage.setItem('projectList', data)
            setNetworkStatus(true)
        } catch(error) {
            console.log("error: ", error)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    console.log("projectArray", projectArray)
    console.log("networkStatus", networkStatus)
    console.log("!networkStatus", !networkStatus)

    !networkStatus && console.log("conditioned", networkStatus)

    async function getOfflineData(){

        var data = await localForage.getItem("projectList").then(project => project)
        setOfflineArray(data)
        console.log("offline data", data)
        setNetworkStatus(true)
    }

    if (!networkStatus && offlineArray && offlineArray.length === 0) {
        getOfflineData()
        console.log("this is not offline")
    }
    
    
    return(
        <>
            <Navbar />
            {projectArray && offlineArray && projectArray.length === 0 && offlineArray.length === 0 && <LinearProgress />}
            {projectArray && projectArray.length !== 0 ? projectArray.map(
                (project, index) => <Preview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />
            ) : offlineArray && offlineArray.length !== 0 && offlineArray.map(
                (project, index) => <Offlinepreview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />)
            }
        </>
    )
}