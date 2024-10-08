const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors())
app.use(express.json());

// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x69co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection

        const resourceCollection = client.db('resourceDB').collection('videos')
        const postCollection = client.db('resourceDB').collection('posts')

        app.get('/resources', async(req, res)=>{
            const limit = req.query.limit? parseInt(req.query.limit) : 0;
            const cursor = resourceCollection.find().limit(limit);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/resources/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await resourceCollection.findOne(query);
            res.send(result)
        })

        app.get('/posts', async(req, res)=>{
            const cursor = postCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/resourcesCount', async(req, res)=>{
            const count = await resourceCollection.estimatedDocumentCount();
            res.send({count})
        })

        app.post('/resources', async(req, res)=>{
            const resourceData = req.body;
            // console.log(resourceData);
            const result = await resourceCollection.insertOne(resourceData);
            res.send(result)
        })

        app.post('/posts', async(req, res)=>{
            const postData = req.body;
            // console.log(postData);
            const result = await postCollection.insertOne(postData);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Academic Shelf server is running.')
})

app.listen(port, (req, res) => {
    console.log(`Academic Shelf server running on port ${port}`);
})