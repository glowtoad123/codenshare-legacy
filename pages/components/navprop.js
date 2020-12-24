import React from 'react'
import styles from '../css/nav.module.css'

export default function Navprop(props){
    return(
        <div className={styles.navprop}>
            <img alt="pic" className={styles.pic} title={props.description} src={props.pic} />
        </div>
    )
}