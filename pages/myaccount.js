import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import crypto from 'crypto'
import faunadb, { query as q } from "faunadb"
import Navbar from './navbar'
import Link from 'next/link'
import * as localForage from "localforage"
import Advpreview from './components/advpreview'
import Offlinepreview from './components/offlinepreview'
import styles from './css/account.module.css'
import { LinearProgress } from '@material-ui/core'

export default function Myaccount(){
    var serverClient = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });

    const router = useRouter()

    const [userName, setUserName] = useState("")
    const [userId, setUserId] = useState("")
    const [yourKey, setYourKey] = useState("")
    const [receivedKey, setReceivedKey] = useState("")
    const [projectsArray, setProjectsArray] = useState([])
    const [projectsIdArray, setProjectsIdArray] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)
    const [offlineArray, setOfflineArray] = useState([])
    const [deleteStatus, setDeleteStatus] = useState(false)

    localForage.getItem("userName").then(ret => {
        setUserName(ret)
    })
    
    localForage.getItem("yourKey").then(ret => {
        setYourKey(ret)
    })

    localForage.getItem("userId").then(ret => {
        setUserId(ret)
    })

    projectsArray.length === 0 && serverClient.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index("creatorsworks"), userName)
            ),
            q.Lambda("Project", q.Get(q.Var('Project')))
        )
    ).then((ret, index) => {
        setProjectsArray(ret.data.map(project => project.data));
        setProjectsIdArray(ret.data.map(project => project.ref.id));
        localForage.setItem("userProjectList", ret.data.map(project => project.data)).then(ret => {
            setNetworkStatus(true);
        });
    })

    receivedKey.length === 0 && serverClient.query(
        q.Get(
            q.Ref(q.Collection("Accounts"), userId)
        )
    ).then(ret => {setReceivedKey(ret.data.password); console.log(ret.data.password)})

    function deleteProject(event){
        var confirmDeletion = confirm("Are you sure you want to delete that project?");
            if (confirmDeletion == true) {
                !deleteStatus && serverClient.query(
                    q.Delete(
                        q.Ref(q.Collection("Projects"), event.target.id)
                    )
                ).then(ret => {
                    console.log(ret);
                    setDeleteStatus(true)
                })
                alert("This project has been deleted")
            }
    }

    deleteStatus && serverClient.query(
        q.Map(
            q.Paginate(
                q.Match(q.Index("creatorsworks"), userName)
            ),
            q.Lambda("Project", q.Get(q.Var('Project')))
        )
    ).then((ret, index) => {
        setProjectsArray(ret.data.map(project => project.data));
        setProjectsIdArray(ret.data.map(project => project.ref.id));
        setDeleteStatus(false)
    })

    function updateName(event){

        var changeuserName = prompt("please update your username")

        if (changeuserName !== "" && changeuserName !== null) {
            var updatePassword = prompt("please enter your old password or change your password to continue")
            if(updatePassword !== "" && updatePassword !== null) {
                const hashedPassword = updatePassword + changeuserName
                const hash = crypto.createHash('sha256')
                hash.update(hashedPassword)
                const alphaPassword = hash.digest("hex")
                console.log("alphaPassword: " + alphaPassword)
                crypto.pbkdf2(alphaPassword, 'salt', 10, 64, 'sha512', (err, derivedKey) => {
                    if (err) throw err;
                    serverClient.query(
                        q.Get(
                          q.Match(q.Index('dublicateUsername'), changeuserName)
                        )
                      )
                      .then((ret) => {console.log(ret.data.username); alert("Sorry, but this username has alread been taken")}, (err) => {
                        serverClient.query(
                            q.Update(
                              q.Ref(q.Collection("Accounts"), userId),
                              { data: {
                                  username: changeuserName,
                                  password: derivedKey.toString('hex')
                                }},
                            )
                          )
                          .then((ret) => {
                              console.log(ret); 
                              localForage.setItem("userName", changeuserName);
                              localForage.setItem("yourKey", ret.data.password);
                              localForage.setItem("userId", ret.ref.id)
                            });
                    
                        projectsIdArray.map(id => {serverClient.query(
                          q.Update(
                            q.Ref(q.Collection('Projects'), id),
                            { data: {Creator: changeuserName}},
                          )
                        )
                        .then((ret) => {
                            console.log(ret);
                            router.reload()
                        })})
                      })

                })
            } else {
                alert("username not changed")
            }
        } else {
            alert("username not changed")
        }
    }
    

    offlineArray && offlineArray.length === 0 &&
            localForage.getItem("userProjectList").then(ret => {
                setOfflineArray(ret)
            })

    console.log(offlineArray)
    console.log("networkStatus: " + networkStatus)

    return(
        <>
        <Navbar />
        {yourKey === receivedKey && networkStatus ?
            <>
                <div className={styles.head}>
                    <h1 className={styles.displaytitle}><strong>{userName}</strong></h1>
                    <img src="/edit.svg" className={styles.save} onClick={updateName}/>
                        
                </div>
                {projectsArray.map((project, index) =>
                        <Advpreview 
                            id={projectsIdArray[index]}
                            project={project.Project_Title}
                            description={project.Description}
                            creator={project.Creator}
                            categories={project.Categories}
                            delete={deleteProject}
                        />
                )}
            </>
        : !networkStatus ? 
            <>
                <div className={styles.head}>
                    <h1 className={styles.displaytitle}><strong>{userName}</strong></h1>
                </div>
                {offlineArray && offlineArray.map((project, index) =>
                        <Offlinepreview 
                            id={projectsIdArray[index]}
                            project={project.Project_Title}
                            description={project.Description}
                            creator={project.Creator}
                            categories={project.Categories}
                            delete={deleteProject}
                        />
                )}

                { projectsArray.length === 0 && offlineArray.length === 0 && <LinearProgress />}
            </>
        :
            <h1>sorry but no hackers are allowed to change another user's data</h1>
        }
        </>
    )
}