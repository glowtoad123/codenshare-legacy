import React, {useState, useEffect} from 'react'
import { Router, useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import * as localForage from "localforage"
import Preview from './components/preview'
import Navbar from './navbar'
import styles from './css/project.module.css'

export default function found(){

    var serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });

    const [projectArray, setProjectArray] = useState([])
    const [projectIdArray, setProjectIdArray] = useState([])
    const [queriedList, setQueriedList] = useState([])
    const [selection, setSelection] = useState("")
    const [foundStatus, setFoundStatus] = useState(false)

    
    const router = useRouter()
    const searchedInfo = router.query.title
    
    localForage.getItem("foundStatus").then(ret =>
        setFoundStatus(ret)
    )

    foundStatus && localForage.setItem("foundStatus", false).then(
        router.reload()
    )
    

    console.log(searchedInfo)

    projectArray.length === 0 && serverClient.query(
        q.Map(
            q.Paginate(q.Match(q.Index("projects"))),
            q.Lambda("X", q.Get(q.Var("X")))
          )
    ).then(ret => {
        setProjectArray(ret.data.map(project => project.data)),
        console.log(ret.data.map(project => project.data)),
        setProjectIdArray(ret.data.map(project => project.ref.id))
    })

    localForage.getItem("Selection").then(ret => setSelection(ret))

    if(selection === "title"){
        const results = projectArray.filter(project => {return project.Project_Title.includes(searchedInfo)})
        if(results.length > 0 && queriedList.length == 0){
            setQueriedList(results)
            console.log(results)
        }
    }

    if(selection === "categories"){
        const searchTagsList = searchedInfo.split(" ")
        const searchResults = searchTagsList.map(one => projectArray.filter(each => each.Categories.includes(one)))
        const finalResults = []
        const enhancedResults = searchResults.map(queriedProjectLists => queriedProjectLists.filter(project => finalResults.push(project)))
        if(finalResults.length > 0 && queriedList.length == 0){
            setQueriedList(finalResults)
            console.log(finalResults)
        }
    }
    
    if(selection === "description"){
        const results = projectArray.filter(project => {return project.Description.includes(searchedInfo)})
        if(results.length > 0 && queriedList.length == 0){
            setQueriedList(results)
            console.log(results)
        }
    }

    return(
        <>
        <Navbar />
        <h1 className={styles.textHead} style={{margin: "0"}}>Search Results</h1>
        <br />
        {queriedList.map((project, index) => 
            <Preview 
                    id={projectIdArray[index]}
                    project={project.Project_Title}
                    description={project.Description}
                    creator={project.Creator}
                    categories={project.Categories}
                />
        )}
        <br />
        </>
    )
}