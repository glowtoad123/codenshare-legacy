import React, {useState, useEffect} from 'react'
import faunadb, { query as q } from "faunadb"
import * as localForage from "localforage"
import Preview from './components/preview'
import Offlinepreview from './components/offlinepreview'
import Navbar from './navbar'
import { LinearProgress } from '@material-ui/core'

export default function Home(){
    const [projectArray, setProjectArray] =  useState([])
    const [offlineArray, setOfflineArray] = useState([])
    const [idArray, setIdArray] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)
    
    var serverClient = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });

    console.log("key: " + process.env.NEXT_FAUNA_KEY)

    !networkStatus && serverClient.query(
        q.Map(
            q.Paginate(q.Match(q.Index("projects"))),
            q.Lambda("X", q.Get(q.Var("X")))
        )
    ).then(ret => {
        setProjectArray(ret.data.map(project => project.data)),
        setIdArray(ret.data.map(work => work.ref.id)),
        localForage.setItem("projectList", ret.data.map(project =>
            project.data
        )).then(ret => 
            console.log("has been set")
         ).catch(err => console.log(err)),
        setNetworkStatus(true)
    })

    offlineArray && offlineArray.length === 0 && localForage.getItem("projectList").then(project => {
        setOfflineArray(project);
    }).then(
        ret => console.log("got data"),
     ).catch(err => console.log(err))
    
    
    
    return(
        <>
            <Navbar />
            {projectArray && offlineArray && projectArray.length === 0 && offlineArray.length === 0 && <LinearProgress />}
            {networkStatus ? projectArray.map(
                (project, index) => <Preview 
                    id={idArray[index]}
                    project={project.Project_Title}
                    description={project.Description}
                    creator={project.Creator}
                    categories={project.Categories}
                />
            ) : offlineArray && offlineArray.map(
                (project, index) => <Offlinepreview 
                    id={idArray[index]}
                    project={project.Project_Title}
                    description={project.Description}
                    creator={project.Creator}
                    categories={project.Categories}
                />)
            }
        </>
    )
}