const express = require('express')
const app = express()
const port = process.env.PORT || 3001;
app.use(express.json())
// Middleware 
var cors = require('cors')
app.use(cors())
require('dotenv').config()
// Database connect
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hli29av.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const doctorsCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('booking');
        //
        app.get('/services', async (req, res) => {
            const query = {};
            const result = await doctorsCollection.find(query).toArray();
            res.send(result)
        });

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { treatment: booking.treatment, data: booking.data };
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists });
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result });
        });

    }
    finally {
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('backend worked')
})

app.listen(port, () => {
    console.log('listening port:', port)
})