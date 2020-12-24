import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Navbar from './navbar'
import * as localForage from "localforage"
import Preview from './components/preview'
import styles from './css/account.module.css'
import { LinearProgress } from '@material-ui/core'

export default function Account({id}){

    const [projectsArray, setProjectsArray] = useState([])

    const router = useRouter()

    async function getYourProjects(){
        const res = await fetch("api/getYourProjects", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({creator: id})
        })
        let data = await res.json()

        console.log(data)
        setProjectsArray(data)
    }

    useEffect(() => {
        getYourProjects()
        localForage.getItem("userName").then(ret =>
            ret === id && router.push("/myaccount")
        )
    }, [])



    return(
        <>
            <Navbar />
            <div className={styles.head}>
                <h1 className={styles.displaytitle}><strong>{id}</strong></h1>
            </div>
            {projectsArray.map((project, index) =>
                <Preview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />)}
            {projectsArray.length === 0 && <LinearProgress />}
        </>
    )
}

export async function getServerSideProps(context){
    return {props: {
        id: context.query.title
    }}
}