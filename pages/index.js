import React, {useState, useEffect} from 'react'
import faunadb, { query as q } from "faunadb"
import * as localForage from "localforage"
import Preview from './components/preview'
import Offlinepreview from './components/offlinepreview'
import Navbar from './navbar'

export default function Home(){
    const [projectArray, setProjectArray] =  useState([])
    const [offlineArray, setOfflineArray] = useState([])
    const [idArray, setIdArray] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)
    
    var serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });

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