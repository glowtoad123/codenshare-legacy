import React, {useState, useEffect} from 'react'
import { Router, useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import * as localForage from "localforage"
import Preview from './components/preview'
import Navbar from './navbar'
import styles from './css/project.module.css'
import { LinearProgress } from '@material-ui/core'

export default function found(){
    var serverClient = new faunadb.Client({ secret: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe' });
    const [projectArray, setProjectArray] = useState([])
    const [wholeProjects, setWholeProjects] = useState({})
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

    localForage.getItem("Selection").then(ret => setSelection(ret))

    queriedList.length === 0 && serverClient.query(
        q.Map(
            q.Paginate(q.Match(q.Index("projects"))),
            q.Lambda("X", q.Get(q.Var("X")))
          )
    ).then(ret => {
        if(selection === "title"){
            const results = ret.data.filter(projects => {
                return projects.data.Project_Title.includes(searchedInfo)
            })

            console.log(results)

            if(results.length > 0 && queriedList.length === 0){
                setQueriedList(results)
            }
        }

        if(selection === "description"){
            const results = ret.data.filter(projects => {
                return projects.data.Description.includes(searchedInfo)
            })

            if(results.length > 0 && queriedList.length === 0){
                setQueriedList(results)
            }
        }

        if(selection === "categories"){
            const searchCategoriesList = searchedInfo.split(" ")
            const searchResults = searchCategoriesList.map(one => 
                ret.data.filter(projects => 
                    projects.data.Categories.includes(one)
                )
            )

            const finalResults = []
            const enhancedResults = searchResults.map(queriedProjectLists => queriedProjectLists.filter(project => finalResults.push(project)))
            if(finalResults.length > 0 && queriedList.length == 0){
                setQueriedList(finalResults)
                console.log(finalResults)
            }
        }
    })

    return(
        <>
        <Navbar />
        <h1 className={styles.textHead} style={{margin: "0"}}>Search Results</h1>
        <br />
        {queriedList && queriedList.length === 0 && <LinearProgress />}
        {queriedList.map(project => 
            <Preview
                id={project.ref.id}
                project={project.data.Project_Title}
                description={project.data.Description}
                creator={project.data.Creator}
                categories={project.data.Categories}
            />
        )}
        </>
    )
}