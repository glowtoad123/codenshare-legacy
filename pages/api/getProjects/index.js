import faunadb, { query as q } from "faunadb"

module.exports = async function(req, res){
    var client = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });

    try {
        const dbs = await client.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index("projects")
                    )
                ),
                (ref) => q.Get(ref)
            )
        )
        res.status(200).json(dbs.data)
    } catch(error) {
        res.status(500).json({Error: error.message})
    }
}