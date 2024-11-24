const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()







//middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.texsw4y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection// await client.db("admin").command({ ping: 1 });

    const usersCollection = client.db("TaskTrack").collection("users");
    const taskCollection = client.db("TaskTrack").collection("task");

    //jwt section
    

    // middlewares 
    //verify jwt
  
    //users section
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)

    })
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await usersCollection.findOne(query)
      res.send(result)
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existsUser = await usersCollection.findOne(query);
      if (existsUser) {
        return res.send({ message: 'user already exist', insertedId: null })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })
  
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })
    //task section
    app.get('/task', async (req, res) => {
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        const result = await taskCollection.find().skip(page * size).limit(size).toArray();
        res.send(result)
      })
      app.get('/task/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.findOne(query);
        res.send(result);
      });
      app.post('/task', async (req, res) => {
        const item = req.body;
        const result = await taskCollection.insertOne(item);
        res.send(result);
      })
      app.patch('/task/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            name: item.name, // Referencing `item` instead of `data`
            description: item.description,
        
          }
        }
        const result = await taskCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });
      app.delete('/task/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      });
  

   

    //task section
    


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('TaskTrack server is running')
})
app.listen(port, () => {
  console.log(`TaskTrack is running ${port}`);
})