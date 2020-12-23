import React, {useState, useEffect} from 'react'
import { Router, useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import * as localForage from "localforage"
import Preview from './components/preview'
import Navbar from './navbar'
import styles from './css/project.module.css'
import { LinearProgress } from '@material-ui/core'

export default function found({searchedInfo}){
    var serverClient = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });
    const [projectArray, setProjectArray] = useState([])
    const [wholeProjects, setWholeProjects] = useState({})
    const [projectIdArray, setProjectIdArray] = useState([])
    const [queriedList, setQueriedList] = useState([])
    const [selection, setSelection] = useState("")
    const [foundStatus, setFoundStatus] = useState(false)

    const router = useRouter()

    

    async function gettingData(){


        let savedSelection = await localForage.getItem("Selection").then(type => type)
        setSelection(savedSelection)

        const res = await fetch("api/getProjects", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })

        let data = await res.json()

        
        if(savedSelection === "title"){
            const results = data.filter(projects => {
                return projects.data.Project_Title.includes(searchedInfo)
            })

            console.log(results)

            if(results.length > 0 && queriedList.length === 0){
                setQueriedList(results)
            }
        }

        if(savedSelection === "description"){
            const results = data.filter(projects => {
                return projects.data.Description.includes(searchedInfo)
            })

            if(results.length > 0 && queriedList.length === 0){
                setQueriedList(results)
            }
        }

        if(savedSelection === "categories"){
            const searchCategoriesList = searchedInfo.split(" ")
            const searchResults = searchCategoriesList.map(one => 
                data.filter(projects => 
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
    }

    useEffect(() => {
        gettingData()
    }, [])

    gettingData()

    return(
        <>
        <Navbar />
        <h1 className={styles.textHead} style={{margin: "0"}}>Search Results</h1>
        <br />
        {queriedList && queriedList.length === 0 && <LinearProgress />}
        {queriedList.map(project => 
            <Preview
                id={project.ref['@ref'].id}
                project={project.data.Project_Title}
                description={project.data.Description}
                creator={project.data.Creator}
                categories={project.data.Categories}
            />
        )}
        </>
    )
}

export async function getServerSideProps(context){
    return {props: {
        searchedInfo: context.query.title
    }}
}