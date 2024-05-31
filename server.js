const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection URL and Database Name
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'userAuth';

app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(mongoURL, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Sign-up endpoint
        app.post('/signup', async (req, res) => {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.json({ message: 'Username and password are required' });
            }

            try {
                const user = await usersCollection.findOne({ username });
                if (user) {
                    return res.json({ message: 'Username already exists' });
                }

                await usersCollection.insertOne({ username, password });
                res.json({ message: 'Sign up successful' });
            } catch (err) {
                res.json({ message: 'Error saving user details' });
            }
        });

        // Login endpoint
        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.json({ message: 'Username and password are required' });
            }

            try {
                const user = await usersCollection.findOne({ username, password });
                if (user) {
                    res.json({ message: 'Login successful' });
                } else {
                    res.json({ message: 'Invalid username or password' });
                }
            } catch (err) {
                res.json({ message: 'Error reading user details' });
            }
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    })
    .catch(error => console.error(error));
