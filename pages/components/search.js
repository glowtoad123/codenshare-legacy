import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as localForage from "localforage"
import styles from '../css/search.module.css'
import dynamic from 'next/dynamic'
import 'react-bootstrap'
import {Button, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap'

export default function Search() {

    const router = useRouter()

    dynamic(() => import('./bootstrap.bundle'))

    const [searchValue, setsearchValue] = useState("")
    const [searchTagsList, setsearchTagsList] = useState([])
    const [queriedList, setQueriedList] = useState([])
    const [selection, setSelection] = useState("title")

    console.log("selection", selection)

    
    
    function settingSelection(event){
        setSelection(event.target.innerText)
        localForage.setItem("Selection", event.target.innerText)
    }

    function settingsearchValue(event){
        setsearchValue(event.target.value)
        selection === "title" && localForage.setItem("Selection", "title")
        selection === "categories" && localForage.setItem("Selection", "categories")
        selection === "description" && localForage.setItem("Selection", "description")
    }

    function settingsearchList(){
            setsearchTagsList(none => {return [...none, searchValue]})
            setsearchValue("")
    }

    function settingFoundStatus(){
        localForage.setItem("foundStatus", true)
        selection === "title" || selection === 'description' ?  router.push(`found?title=${searchValue}`) : router.push(`found?title=${searchTagsList.join(" ")}`)
    }
    const categorySearchList = searchTagsList.join(" ")
    console.log("categorySearchList: " + categorySearchList)

    return (
        <div className={styles.search}>
            <div className={styles.searchContainer}>
                {/* <input 
                    type="search" 
                    placeholder="search" 
                    className={styles.searchfield} 
                    value={searchValue} 
                    onChange={settingsearchValue}
                /> */}
            {(selection === "title" || selection === "description" || selection === "") && <InputGroup>
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={searchValue} 
                  onChange={settingsearchValue}
                />

                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={selection}
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item data onClick={settingSelection} href="#" value="categories">categories</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="title">title</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="description">description</Dropdown.Item>
                </DropdownButton>
                <InputGroup.Append><Button onClick={settingFoundStatus} variant="outline-secondary">Search</Button>
                </InputGroup.Append>
            </InputGroup>}
            {selection === "categories" && <InputGroup>
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={searchValue} 
                  onChange={settingsearchValue}
                />

                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={selection}
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item data onClick={settingSelection} href="#" value="categories">categories</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="title">title</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="description">description</Dropdown.Item>
                </DropdownButton>
                <InputGroup.Append>
                <Button onClick={settingsearchList} variant="outline-secondary">Add</Button>
                        <Button onClick={settingFoundStatus} variant="outline-secondary">Search</Button> 
                </InputGroup.Append>
            </InputGroup>}
            </div>
            <br />
            {selection === "categories" &&
                <div className="searchdiv">
                    <div className={styles.list}>
                        <label className="searchLabel">Categories: </label>
                        {searchTagsList.map(each => <p className={styles.tags}><strong>{each}</strong></p>)}
                    </div>
                </div> 
            }   
        </div>
    );
}