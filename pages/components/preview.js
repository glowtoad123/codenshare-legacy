import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import styles from '../css/preview.module.css'

export default function Preview(props) {

    return (
        <div className={styles.display}>
            <Link href={`/project?title=${props.id}`}><a><h1 className={styles.displaytitle}><strong>{props.project}</strong></h1></a></Link>
            <div className={styles.descriptionDiv}><strong >{props.description}</strong></div>
            <br />
            <br />
            
            <Link href={`/account?title=${props.creator}`}><a className={styles.creatorName}><strong>{props.creator}</strong></a></Link>
            <br />
            <div className={styles.tagDiv}>{props.categories.map(category => <p className={styles.tags}><strong>{category}</strong></p>)}</div>
        </div>
    )
}