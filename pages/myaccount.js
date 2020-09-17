import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import Navbar from './navbar'
import Link from 'next/link'
import * as localForage from "localforage"
import Advpreview from './components/advpreview'
import styles from './css/account.module.css'

export default function Myaccount(){
    var serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });

    const [userName, setUserName] = useState("")
    const [yourKey, setYourKey] = useState("")
    const [projectsArray, setProjectsArray] = useState([])
    const [projectsIdArray, setProjectsIdArray] = useState([])
    const [deleteStatus, setDeleteStatus] = useState(false)

    localForage.getItem("userName").then(ret => {
        setUserName(ret)
    })
    
    localForage.getItem("yourKey").then(ret => {
        setYourKey(ret)
    })

    projectsArray.length === 0 && serverClient.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index("creatorsworks"), userName)
            ),
            q.Lambda("Project", q.Get(q.Var('Project')))
        )
    ).then((ret, index) => {
        setProjectsArray(ret.data.map(project => project.data));
        setProjectsIdArray(ret.data.map(project => project.ref.id))
    })

    function deleteProject(event){
        var confirmDeletion = confirm("Are you sure you want to delete that project?");
            if (confirmDeletion == true) {
                !deleteStatus && serverClient.query(
                    q.Delete(
                        q.Ref(q.Collection("Projects"), event.target.id)
                    )
                ).then(ret => {
                    console.log(ret);
                    setDeleteStatus(true)
                })
                alert("This project has been deleted")
            }
    }

    deleteStatus && serverClient.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index("creatorsworks"), userName)
            ),
            q.Lambda("Project", q.Get(q.Var('Project')))
        )
    ).then((ret, index) => {
        setProjectsArray(ret.data.map(project => project.data));
        setProjectsIdArray(ret.data.map(project => project.ref.id));
        setDeleteStatus(false)
    })

    return(
        <>
        <Navbar />
        {projectsArray.map((project, index) =>
                <Advpreview 
                    id={projectsIdArray[index]}
                    project={project.Project_Title}
                    description={project.Description}
                    creator={project.Creator}
                    categories={project.Categories}
                    delete={deleteProject}

                />)}
        </>
    )
}