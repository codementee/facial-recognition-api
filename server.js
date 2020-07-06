const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const pg = require('pg');
const { response } = require('express');

const register = require('./cont  rollers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/get-profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true
    }
  });

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',
//     password : 'dbpass',
//     database : 'fcrec'
//   }
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send("It is working!") })

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

// dependencies injection
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.Port || 3000, () => {
    console.log(`app is running on ${process.env.Port}`)
});


/*
res --> this is working
signin --> POST = success/fail
register --> POST = user
profile/:userId  --> GET <-- user
image end point --> PUT  <-- user    
*/