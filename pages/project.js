import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import Navbar from './navbar'
import Link from 'next/link'
import styles from './css/project.module.css'
import * as localForage from "localforage"

export default function Project() {
    const serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });
    
    const [yourKey, setYourKey] = useState("")
    const [receivedKey, setReceivedKey] = useState("")
    const [projectData, setProjectData] = useState({})
    const [linkList, setLinkList] = useState([])
    const [roadmap, setRoadmap] = useState([])
    const [Categories, setCategories] = useState([])
    const [update, setUpdate] = useState([])
    const [creator, setCreator] = useState("")
    const [deleteStatus, setDeleteStatus] = useState(false)
    
    const router = useRouter()
    const projectId = router.query.title

    yourKey === "" && localForage.getItem("yourKey").then(ret => {
            
                setYourKey(ret)
                console.log(ret)
        })

    console.log(projectData)

    creator === ""  && serverClient.query(
        q.Get(
            q.Ref(q.Collection("Projects"), projectId)
        )
    ).then(ret => {
        setProjectData(ret.data);
        setCreator(ret.data.Creator);
        setLinkList(ret.data.Links);
        setRoadmap(ret.data.Roadmap);
        setCategories(ret.data.Categories);
        setUpdate(ret.data.Update)
    })

    creator.length !== 0 && receivedKey.length === 0 && serverClient.query(
        q.Get(
            q.Match(q.Index("dublicateUsername"), creator)
        )
    ).then(ret => {
        setReceivedKey(ret.data.password);
        console.log(ret.data.password)
    })

    function deleteProject(event){
        var confirmDeletion = confirm("Are you sure you want to delete that project?");
            if (confirmDeletion == true) {
                !deleteStatus && serverClient.query(
                    q.Delete(
                        q.Ref(q.Collection("Projects"), projectId)
                    )
                ).then(ret => {
                    console.log(ret);
                    setDeleteStatus(true)
                })
                alert("This project has been deleted")
            }
    }

    const changeLog = update.map(change => change.Changes)

    return(
        <>
            <Navbar />
            <div className={styles.userDisplay}>
                <h1 className="displaytitle">
                    <strong>{projectData.Project_Title}</strong>
                </h1>
                {yourKey === receivedKey && <div>
                    <Link href={`/update?title=${projectId}`}><a>
                        <img 
                            id={projectData.Id}
                            title={projectData.description} 
                            name={projectData.Project_Title} 
                            className={styles.edit} 
                            src='/edit.svg'
                        />
                    </a></Link>
                    <img 
                        name={projectData.Project_Title} 
                        src="/delete.svg" 
                        className={styles.delete} 
                        onClick={deleteProject}
                    />
                </div>}
                <div className={styles.inquisite}>
                    <svg className={styles.withininquisite} id="inquisiting" width="3em" height="3em" viewBox="0 0 16 16" class="bi bi-eye-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path fill-rule="evenodd" d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                    <label className={styles.withininquisite} type="text">become an inquisitor</label>
                </div>
                <br />
                <br />
                <Link href={`/account?title=${projectData.Creator}`}><a className={styles.creatorName}><strong>{projectData.Creator}</strong></a></Link>
                <br />
                <a className={styles.respository} href={projectData.Repository}>{projectData.Repository}</a>
                <br />
                {linkList.length > 0 && linkList.map(each => 
                    <a 
                        className={styles.respository} 
                        href={each}>{each}
                    </a>
                ) }
                <p className={styles.description}><strong>{projectData.Description}</strong></p>
                <br />
                <h1 className={styles.textHead}><strong>Roadmap</strong></h1>
                <br />
                {roadmap.length > 0 && roadmap.map(each => <p className={styles.tags}><strong>{each}</strong></p>)}
                <br />
                <br />
                <br />
                <h1 className={styles.textHead}><strong>Categories</strong></h1>
                <br />
                {Categories.length > 0 && Categories.map(each => <p className={styles.tags}><strong>{each}</strong></p>)}
                <br />
                {<div className={styles.updateList}>{update.length > 0 && 
                    update.map((current, index) => {return (
                        <div className={styles.update}>
                            <h2 className={styles.textHead}>Version {current.Version}</h2>
                            <br />
                            <h3 className={styles.changelogLabel}>Changelog</h3>
                            <br />
                            <div className={styles.changeDiv}>{changeLog[index].map(one => 
                                <p className={styles.tags}><strong>{one}</strong></p>
                            )}</div></div>)})}
                        </div>}
            </div>
        </>
    )
}