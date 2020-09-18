import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as localForage from "localforage"
import styles from '../css/search.module.css'

export default function Search() {

    const [searchValue, setsearchValue] = useState("")
    const [searchTagsList, setsearchTagsList] = useState([])
    const [queriedList, setQueriedList] = useState([])
    const [selection, setSelection] = useState("")

    console.log(selection)

    
    function settingsearchValue(event){
        setsearchValue(event.target.value)
        setSelection(document.getElementById("searchtype").value)
        localForage.setItem("Selection", document.getElementById("searchtype").value)
    }

    function settingSelection(){
        setSelection(document.getElementById("searchtype").value)
        localForage.setItem("Selection", document.getElementById("searchtype").value)
    }

    function settingsearchList(){
        var selection = document.getElementById("searchtype")
        if(selection.value === "categories"){
            setsearchTagsList(none => {return [...none, searchValue]})
            setsearchValue("")
        }
    }

    function settingFoundStatus(){
        localForage.setItem("foundStatus", true)
    }
    const categorySearchList = searchTagsList.join(" ")
    console.log("categorySearchList: " + categorySearchList)

    return (
        <div className={styles.search}>
            <input 
                type="search" 
                placeholder="search" 
                className={styles.searchfield} 
                value={searchValue} 
                onChange={settingsearchValue}
            />
            <img 
                src="/plus.svg" 
                className={styles.button} 
                onClick={settingsearchList}
            />
            {(selection === "title" || selection === "description") && 
                <Link href={`found?title=${searchValue}`}>
                    <a><img onClick={settingFoundStatus} src="/search.png" className={styles.button}/></a>
                </Link>
            }
            {selection === "categories" && 
                <Link href={`found?title=${searchTagsList.join(" ")}`}>
                    <a><img src="/search.png" className={styles.button}/></a>
                </Link>
            }
            <select onClick={settingSelection} id="searchtype" class={styles.searchtype}>
                <option id="1" value="categories">categories</option>
                <option id="2" value="title">title</option>
                <option id="3" value="description">description</option>
            </select>
            <br />
            {selection === "categories" &&
                <div className="searchdiv">
                    <div className={styles.list}>
                        <label className="searchLabel">Categories search List</label>
                        {searchTagsList.map(each => <p className={styles.tags}><strong>{each}</strong></p>)}
                    </div>
                </div> 
            }   
        </div>
    );
}