const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const orderCollection = database.collection('orders')


        // GET Service API
        app.get('/rooms', async(req,res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //add new Room Api
        // app.post('/addRoom', async(req, res) => {
        //   const result = await serviceCollection.insertOne(req.body);
        //   console.log(result);
        //   res.json(result.insertedId);
        // })
        //Post Api
        app.post('/services', async(req, res) => {
          const service = req.body;
          console.log('hit the api', service);

          const result = await serviceCollection.insertOne(service)
          console.log(result);
          res.send(result);
        })

        // get add room
        app.get('/rooms', async(req, res) => {
          const result = await serviceCollection.find({}).toArray();
          res.send(result);
        })

        // Order book post api
        app.post('/myorder', async(req, res) => {
          const order = req.body;
          console.log('hitting the order', order);
          const result = await orderCollection.insertOne(order);
          console.log(result);
          res.json(result);
        });

        //my order GET API
        app.get('/order/:email', async(req, res) => {
          console.log(req.params.email)
          const query = {email: req.params.email};
          console.log(query) 
          const result = await orderCollection.find({email:  req?.params?.email}).toArray();
          console.log('get the api service', result);
           res.json(result);
        });

        // DELETE API
        app.delete('/order/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id)
          const query = { _id: ObjectId(id) };
          const result = await orderCollection.deleteOne(query);
          console.log('deleting user with id', id);
          res.json(result);
        })

        // manage all order get api
        app.get('/orders', async(req, res) => {
          const cursor = orderCollection.find({})
          const result = await cursor.toArray();
          res.send(result);  
          console.log('all orders here',result)
        }) ;

        // delete manage all orders
         // DELETE API
         app.delete('/orders/:id', async (req, res) => {
          const id = req.params.id;
          console.log(id)
          const query = { _id: ObjectId(id) };
          const result = await orderCollection.deleteOne(query);
          console.log('deleting user with id', id);
          res.json(result);
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