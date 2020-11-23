import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import Navbar from './navbar'
import Link from 'next/link'
import * as localForage from "localforage"
import Preview from './components/preview'
import styles from './css/account.module.css'
import { LinearProgress } from '@material-ui/core'

export default function Account(){
    var serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });

    const [projectsArray, setProjectsArray] = useState([])
    const [projectsIdArray, setProjectsIdArray] = useState([])

    const router = useRouter()
    const creatorName = router.query.title

    localForage.getItem("userName").then(ret =>
        ret === creatorName && router.push("/myaccount")
    )

    projectsArray.length === 0 && serverClient.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index("creatorsworks"), creatorName)
            ),
            q.Lambda("Project", q.Get(q.Var('Project')))
        )
    ).then((ret, index) => {
        setProjectsArray(ret.data.map(project => project.data));
        setProjectsIdArray(ret.data.map(project => project.ref.id))
    })

    console.log(projectsArray)

    return(
        <>
            <Navbar />
            <div className={styles.head}>
                <h1 className={styles.displaytitle}><strong>{creatorName}</strong></h1>
            </div>
            {projectsArray.map((project, index) =>
                <Preview 
                    id={projectsIdArray[index]}
                    project={project.Project_Title}
                    description={project.Description}
                    creator={project.Creator}
                    categories={project.Categories}
                />)}
            {projectsArray.length === 0 && <LinearProgress />}
        </>
    )
}