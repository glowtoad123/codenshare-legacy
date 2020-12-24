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
        const res = await fetch("api/getProjects", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })

        let data = await res.json()
        console.log("data: ", data)
        setProjectArray(data)
        localForage.setItem('projectList', data)
        setNetworkStatus(true)
    }

    useEffect(() => {
        getProjects()
    }, [])

    if(!networkStatus && projectArray && projectArray === []) async () => {
        var data = await localForage.getItem("projectList").then(project => project)
        setOfflineArray(data)
    }
    
    
    return(
        <>
            <Navbar />
            {projectArray && offlineArray && projectArray.length === 0 && offlineArray.length === 0 && <LinearProgress />}
            {networkStatus ? projectArray.map(
                (project, index) => <Preview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />
            ) : offlineArray && offlineArray.map(
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