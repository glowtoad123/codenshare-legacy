import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import Navbar from './navbar'
import Link from 'next/link'
import styles from './css/edit.module.css'
import * as localForage from "localforage"
import { LinearProgress } from '@material-ui/core'

export default function Update(){

    const serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });

    const [yourKey, setYourKey] = useState("")
    const [receivedKey, setReceivedKey] = useState("")
    const [projectData, setProjectData] = useState({})
    const [creator, setCreator] = useState("")
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState([])
    const [link, setLink] = useState("")
    const [linkList, setLinkList] = useState([])
    const [goal, setGoal] = useState("")
    const [roadmap, setRoadmap] = useState([])
    const [change, setChange] = useState("")
    const [changeLog, setChangeLog] = useState([])
    const [updateList, setUpdateList] = useState([])
    const [version, setVersion] = useState("")
    const [versionButtonStatus, setVersionButtonStatus] = useState(false)

    const router = useRouter()
    const projectId = router.query.title

    yourKey.length == 0 && localForage.getItem("yourKey").then(ret => {
            
        setYourKey(ret)
        console.log(ret)
    })

    creator.length === 0 && serverClient.query(
        q.Get(
            q.Ref(q.Collection("Projects"), projectId)
        )
    ).then(ret => {
        setProjectData(ret.data);
        setCreator(ret.data.Creator);
        setLinkList(ret.data.Links);
        setRoadmap(ret.data.Roadmap);
        setCategories(ret.data.Categories);
        setUpdateList(ret.data.Update)
    })

    creator.length !== 0 && receivedKey.length === 0 && serverClient.query(
        q.Get(
            q.Match(q.Index("dublicateUsername"), creator)
        )
    ).then(ret => {
        setReceivedKey(ret.data.password);
        console.log(ret.data.password)
    })

    function settingData(event){
        const name = event.target.name
        console.log(event.target.name)
        const value = event.target.value
        setProjectData((current) => ({...current, [name]: value}))
    }

    function settingCategory(event){
        setCategory(event.target.value)
    }

    function settingCategories(){
        setCategories(prev => {return [...prev, category]})
        setCategory("")
    }

    function removeCategory(id){
        setCategories(prev => {
            return prev.filter((categories, index) => {return index !== id})
        })
    }

    function settingGoal(event){
        setGoal(event.target.value)
    }

    function settingRoadmap(){
        setRoadmap(current => {return [...current, goal]})
        setGoal("")
    }

    function removeGoal(id){
        setRoadmap(prev => {
            return prev.filter((roadmap, index) => {return index !== id})
        })
    }

    function settingLink(event){
        setLink(event.target.value)
    }

    function settingLinkList(){
        setLinkList(current => {return [...current, link]})
        setLink("")
    }

    function removeLink(id){
        setLinkList(prev => {
            return prev.filter((linkList, index) => {return index !== id})
        })
    }

    function settingChange(event){
        setChange(event.target.value)
    }

    function settingChangeLog(){
        setChangeLog(current => {return [...current, change]})
        setChange("")
    }

    function removeChange(id){
        setChangeLog(prev => {
            return prev.filter((changeLog, index) => {return index !== id})
        })
    }

    function removeUpdate(id){
        setUpdateList(prev => {
            return prev.filter((changeLog, index) => {return index !== id})
        })
    }

    function settingVersion(event){
        setVersion(event.target.value)
    }

    function checkVersionButtonStatus(){
        setVersionButtonStatus(true)
    }

    function addData(event){
        projectData.Categories = categories
        projectData.Roadmap = roadmap
        projectData.Links = linkList
        version.length > 0 && updateList.push({
            Version: version,
            Changes: changeLog
        })
        projectData.Update = updateList
        projectData.Creator = creator;
        serverClient.query(
            q.Update(
                q.Ref(q.Collection("Projects"), projectId),
                    {data: projectData}
            )
        ).then(ret => {
            console.log(ret.data);
            router.push(`/project?title=${projectId}`)
        })
    }

    const versionList = updateList.map(update => update.Version)
    const fullChangeLog = updateList.map(update => update.Changes)

    return(
        <>
        <Navbar />
        {receivedKey === "" && <LinearProgress />}
        {yourKey !== receivedKey ?
            <h1>Sorry but you are not the creator. Therefore you cannot edit this project</h1>
        : 
            <div id={styles.npform}>
                    <input 
                        className={styles.newProjectItem} 
                        onChange={settingData} 
                        name="Project_Title"     
                        value={projectData.Project_Title}   
                        placeholder=" Project Title"   
                        id={styles.Project_Title}    
                    />
                    <textarea 
                        className={styles.newProjectItem} 
                        onChange={settingData} 
                        name="Description"       
                        value={projectData.Description}     
                        placeholder=" Description"     
                        id={styles.Description}      
                    />
                    <input 
                        className={styles.newProjectItem} 
                        onChange={settingData} 
                        name="Repository"       
                        value={projectData.Repository}     
                        placeholder=" Repository"     
                        id={styles.Repository}
                    />
                    <div>
                        <input
                            className={styles.newProjectItem} 
                            onChange={settingCategory} 
                            name="Categories"        
                            value={category}      
                            placeholder="Categories"      
                            id={styles.Categories}
                        />
                        <button 
                            onClick={settingCategories} 
                            id={styles.addCategory} 
                            type="submit"
                        >Add Category
                        </button>
                        <div 
                            className={styles.tagsDiv}
                        >   
                            {categories.map((current, index) => 
                            <p
                                onClick={() => removeCategory(index)}
                                className={styles.tags}
                            >
                                <strong>{current}</strong>
                            </p>)}
                        </div>
                    </div>
                    <br />
                    <div>
                        <input
                            className={styles.newProjectItem} 
                            onChange={settingLink} 
                            name="Link"        
                            value={link}      
                            placeholder="Link"      
                            id={styles.Repository}       
                        />
                        <button 
                            onClick={settingLinkList} 
                            id={styles.addCategory} 
                            type="submit"
                        >Add Link
                        </button>
                        <div 
                            className={styles.tagsDiv}
                        >   
                            {linkList.map((current, index) => 
                            <p 
                                onClick={() => removeLink(index)} 
                                className={styles.tags}
                            >
                                <strong>{current}</strong>
                            </p>)}
                        </div>
                    </div>
                    <br />
                    <input 
                        className={styles.newProjectItem} 
                        onChange={settingGoal} 
                        name="Roadmap"           
                        value={goal}         
                        placeholder="Roadmap"         
                        id={styles.Categories}
                    />
                    <button 
                        onClick={settingRoadmap} 
                        id={styles.addCategory} 
                        type="submit"
                    >Add Goal
                    </button>
                        <div 
                            className={styles.tagsDiv}
                        >
                            {roadmap.map((current, index) => 
                                <p 
                                    onClick={() => removeGoal(index)} 
                                    className={styles.tags}
                                >
                                    <strong>{current}</strong>
                                </p>)}
                        </div>
                        <button onClick={checkVersionButtonStatus} id={styles.addUpdate} type="submit">Add Version</button>
                        {versionButtonStatus === true && (
                            <div 
                                className={styles.versionDiv}
                            >
                                <input 
                                    className={styles.newProjectItem}
                                    onChange={settingVersion} 
                                    name="Version"       
                                    value={version}     
                                    placeholder=" Version #"     
                                    id={styles.Version_num}      
                                />
                                <textarea 
                                    className={styles.newProjectItem} 
                                    onChange={settingChange} 
                                    name="Changes"           
                                    value={change}         
                                    placeholder=" Changes"         
                                    id={styles.Changes}          
                                />
                                <button 
                                    onClick={settingChangeLog} 
                                    id={styles.addCategory} 
                                    type="submit"
                                >Add Change</button>
                                <div 
                                    className={styles.tagsDiv}
                                >
                                    {changeLog.map((current, index) => 
                                        <p 
                                            onClick={() => removeChange(index)} 
                                            className={styles.tags}
                                        >
                                            <strong>{current}</strong>
                                        </p>)}
                                </div>
                            </div>

                        )}
                        <div className={styles.updateList}>
                            {updateList && updateList.map((current, index) => {return (
                                <div className={styles.update}>
                                    <img 
                                        src="/delete.svg"
                                        className={styles.delete}
                                        onClick={() => removeUpdate(index)}
                                    />
                                    <h2>Version {current.Version}</h2>
                                    <h3 className={styles.changelogLabel}>Changelog</h3>
                                    <br />
                                    {fullChangeLog[index].map(one => 
                                        <p className={styles.tags}><strong>{one}</strong></p>)
                                    }
                                </div>
                            )})}
                        </div>
                        
                    <button 
                                onClick={addData} 
                                id={styles.submit} 
                                type="submit"
                    >Save</button>
                </div>
        }
        </>

    )
}