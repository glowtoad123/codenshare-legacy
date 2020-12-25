const { useRouter } = require("next/router");
import React, { useEffect } from 'react'

export default function test({title}) {

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({id: title})
    }

    async function receiveData(){
        const res = await fetch('api/getSingleProject', requestOptions)
        let data = await res.json()
        console.log(data)
    }

    useEffect(() => {receiveData()}, [])

    return (
        <div>
            {title}
        </div>
    )
}


export async function getServerSideProps(context){

    return {props: {title: context.query.title}}
}
