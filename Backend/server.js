// Import our tools
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const dns = require('dns'); // Node's built-in DNS module
require('dotenv').config(); 

// Set public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(["1.1.1.1", "8.8.8.8"]); // added to override computer's default DNS provider

const app = express();

app.use(cors());
app.use(express.json()); //to read json in POST reqs

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) //promise 
   .then(() => { //promise is successful
    console.log('Connected to MongoDB');
   })
   .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message); //if there is an error
   });

app.use('/api/devices', require('./routes/deviceRoutes')); 
// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the NetTrack API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
