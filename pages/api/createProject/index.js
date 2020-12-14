import faunadb, { query as q } from "faunadb"

export default async function(req, res){
    var client = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });

    try {
        const dbs = await client.query(
            q.Create(
                q.Collection("Projects"),
                {
                    data: req.body.projectData
                }
            )
        )
        res.status(200).json(dbs.data)
    } catch(error) {
        res.status(500).json({Error: error.message})
    }

}