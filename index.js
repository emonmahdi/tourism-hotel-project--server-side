const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlqgi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

// middleware
app.use(cors());
app.use(express.json());


async function run (){
    try{
        await client.connect(); 
        const database = client.db('hotelServices');
        const serviceCollection = database.collection('roomService');

        // GET Service API
        app.get('/rooms', async(req,res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //add new Room Api
        app.post('/addRoom', async(req, res) => {
          const result = await serviceCollection.insertOne(req.body);
          console.log(result);
          res.send(result.insertedId);
        })
        // get add room
        app.get('/rooms', async(req, res) => {
          const result = await serviceCollection.find({}).toArray();
          res.send(result);
        })

    }finally{
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hotel Grand Park is Running')
})

app.listen(port, () => {
  console.log('Hotel Grand Park Server is running port', port)
})