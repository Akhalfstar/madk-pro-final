const express = require('express');
const mongoose = require('mongoose');
 const ejs = require('ejs'); 
const http = require('http');
const socketIO = require('socket.io');



const app = express();
const port = 3000;

const server = http.createServer(app);

// Create a socket.io instance
const io = socketIO(server); 



app.set('view engine', 'ejs'); 

// AIzaSyAQcrl3wc2xuXP6HJEdR5kKf7JQ0LCkuTM
// AIzaSyChIT7l6tk2raY7eAU1kKy_b4G66ww_rJw




mongoose.connect('mongodb+srv://mkm0702:mkm16207@cluster0.piqeusy.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});


app.use(express.json());

// Define your schema for the location data
const locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
});

// Create a model based on the schema
const Location = mongoose.model('Location', locationSchema);


// Route to store location data
app.post('/locations', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Create a new location document and save it
        const location = new Location({
            latitude,
            longitude,
        });

        await location.save();

        // Emit a socket event to notify clients about the new location
        io.emit('newLocation', location);

        
        res.status(201).send(location);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to get all location data
app.get('/locations', async (req, res) => {
    try {
        // Retrieve all location documents from the database
        const locations = await Location.find();
        res.send(locations);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Now, you can retrieve the data from the database and pass it to the view
app.get('/map', async (req, res) => {
    try {
        const locations = await Location.find();
        res.render('map', { locations });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
