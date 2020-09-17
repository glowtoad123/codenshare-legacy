import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import * as localForage from "localforage"
import styles from './css/nav.module.css'
import Navprop from './components/navprop'

export default function Navbar(){
    const [userId, setUserId] = useState("")
    const [navCheck, setNavCheck] = useState(false)

    localForage.getItem("userId").then(id => 
        setUserId(id)
    ).catch(err => console.log(err))

    function toggleNav() {
        setNavCheck(current => !current)
    }

    

    return(
        <>
            {navCheck && 
                <div className={styles.navbar}>
                    <Link href="/">
                        <a href="/">
                            <Navprop pic="/book.svg" description="projects" />
                        </a>
                    </Link>
                    <Link href="/new">
                        <a href="/new">
                            <Navprop pic='/plus.svg' description="add" />
                        </a>
                    </Link>
                    {userId.length > 0 && 
                        <Link href={`/account?title=${userId}`}>
                            <a href="/account">
                                <Navprop pic='/user.svg' description="my account" />
                            </a>
                        </Link>
                    }
                    <Link href="/enter">
                        <a href="/enter">
                            <Navprop pic='/login.svg' description="login/switch account" />
                        </a>
                    </Link>
                </div>
                }   
                <img onClick={toggleNav} src="/navpreview.svg" className={styles.navtoggle} />
        </>
    )
}