import React from 'react'
import Link from 'next/link'
import styles from '../css/enter.module.css'

export default function Login(props){
    return(
        <div className={styles.signbox}>
            <input 
                onChange={props.typing}
                className={styles.signfield}
                value={props.username}
                type="text"    
                name="username" 
                id={styles.username} 
                placeholder="username" 
            />
            <input
                onChange={props.typing} 
                className={styles.signfield} 
                value={props.password}    
                type="password" 
                name="password"    
                id={styles.password} 
                placeholder="password" 
            />
            <button 
                    className={styles.submit} 
                    onClick={props.authenticate}
            >Login
            </button>
        </div>
    )
}