import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import crypto from 'crypto'
import * as localForage from "localforage"
import Login from "./components/login";
import Register from "./components/register"

export default function Enter(){

    const hash = crypto.createHash('sha256')
    const [account, setAccount] = useState({})
    
    var serverClient = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });

    const router = useRouter()
    
    useEffect(() => {
        localForage.getItem("isLoggedIn").then(ret => ret && (
            localForage.removeItem("isLoggedIn"),
            location.reload(),
            setAccount({})
            ))
    }, [])

    function readingProgress(event){
        var name = event.target.name
        var value = event.target.value
        setAccount(current => ({...current, [name]: value}))
        console.log(account)
    }

    function readAccount(){
        const combinedPassword = account.password + account.username
        hash.update(combinedPassword)
        const hashedPassword = hash.digest("hex")

        crypto.pbkdf2(hashedPassword, "salt", 10, 64, "sha512", (err, derivedKey) => {
            if(err) throw err;

            serverClient.query(
                q.Get(
                    q.Match(q.Index('account'), derivedKey.toString("hex"), account.username)
                )
            ).then(ret => {
                console.log(ret.data)
                localForage.setItem("yourKey", ret.data.password);
                localForage.setItem("userId", ret.ref.id);
                localForage.setItem("userName", ret.data.username);
                localForage.setItem("isLoggedIn", true);
                router.push("/")
            }, err => {
                alert("you have not entered in your username or password correctly");
                localForage.removeItem("userName")
            })
        })
    }

    function addAccount(){
        const combinedPassword = account.password + account.username
        hash.update(combinedPassword)
        const hashedPassword = hash.digest("hex")

        crypto.pbkdf2(hashedPassword, "salt", 10, 64, "sha512", (err, derivedKey) => {
            if(err) throw err

            serverClient.query(
                q.Get(
                    q.Match(q.Index('dublicateEmail'), account.email)
                )
            ).then(ret => {alert("sorry, but this email has already been taken")},
                   err => {
                       serverClient.query(
                           q.Get(
                               q.Match(q.Index('dublicateUsername'), account.username)
                           )
                       ).then(ret => {alert("Sorry, but this username has alread been taken")},
                              err => {
                                  serverClient.query(
                                      q.Create(
                                          q.Collection('Accounts'),
                                          {data: {email: account.email,
                                                  username: account.username, 
                                                  password: derivedKey.toString("hex")
                                                }
                                          }
                                      )
                                  ).then(ret => {
                                      console.log(ret.data)
                                      localForage.setItem("yourKey", ret.data.password);
                                      localForage.setItem("userId", ret.ref.id);
                                      localForage.setItem("userName", ret.data.username);
                                      localForage.setItem("isLoggedIn", true);
                                      router.push("/")
                                  })
                              }
                       )
                   }
                  )
        })
    }

    return(
        <>
            <Login 
                typing={readingProgress} 
                authenticate={readAccount}
                password={account.password}
                username={account.username}
            />
            <Register 
                typing={readingProgress} 
                authenticate={addAccount}
                email={account.email}
                password={account.password}
                username={account.username}
            />
        </>
    )
}