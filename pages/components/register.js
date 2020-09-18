import React from 'react'
import Link from 'next/link'
import styles from '../css/enter.module.css'

export default function Register(props){
    return(
        <div className={styles.signbox}>
            <input 
                onChange={props.typing}
                className={styles.signfield}
                value={props.email}
                type="email"    
                name="email" 
                id={styles.email} 
                placeholder="email" 
            />
            <input 
                onChange={props.typing}
                className={styles.signfield}
                value={props.username}   
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
            <Link href="/"><a>
                <button 
                    className={styles.submit} 
                    onClick={props.authenticate}
                >Register
                </button>
            </a></Link>
        </div>
    )
}