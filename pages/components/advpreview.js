import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import * as localForage from "localforage"
import styles from '../css/preview.module.css'

export default function Advpreview(props) {

    function settingSelection(){
        localForage.setItem("Selection", "categories")
        localForage.setItem("foundStatus", true)
    }

    return (
        <div className={styles.display}>
            <Link href={`/project?title=${props.id}`}><a><h1 className={styles.displaytitle}><strong>{props.project}</strong></h1></a></Link>
            <div className={styles.descriptionDiv}><strong >{props.description}</strong></div>
            <br />
            <br />
            
            <Link href={`/account?title=${props.creator}`}><a className={styles.creatorName}><strong>{props.creator}</strong></a></Link>
            <br />
            <div className={styles.tagDiv}>{props.categories && props.categories.map(category =>                 
                <Link href={`/found?title=${category}`}>
                    <p onClick={settingSelection} className={styles.tags}><strong>{category}</strong></p>
                </Link>
            )}</div>
            <div className={styles.projectFooter}>
                <img 
                    name={props.project} 
                    src="/delete.svg" 
                    className={styles.delete} 
                    onClick={props.delete}
                    id={props.id}
                />
                <Link href={`/update?title=${props.id}`}>
                    <a 
                        href="/update" 
                        className={styles.edit}
                    ><img 
                        id={props.id} 
                        title={props.description} 
                        name={props.project} 
                        className={styles.edit} 
                        src='/edit.svg' 
                     />
                    </a>
                </Link>
            </div>
        </div>
    )
}