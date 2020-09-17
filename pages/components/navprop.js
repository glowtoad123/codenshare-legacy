import React from 'react'
import styles from '../css/nav.module.css'

export default function Navprop(props){
    return(
        <div className={styles.navprop}>
            <img className={styles.pic} title={props.description} src={props.pic} />
            <div className={styles.description} title={props.description}>
                <strong title={props.description}>{props.description}</strong>
            </div>
        </div>
    )
}