const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const pg = require('pg');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'dbpass',
      database : 'fcrec'
    }
  });

//   db.select('*').from ('users').then(data => {
//     // console.log(data);
// });


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John', 
       		password: '123',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'Bilal', 
            password: '1234',
            email: 'Bilal@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
	console.log(database.users)
    res.send(database.users)
})

app.post('/signin', (req, res) => {

    // for(let i = 0; i < database.users.length; i++) {
        if(req.body.email.toLowerCase() === database.users[0].email.toLowerCase() &&
         req.body.password === database.users[0].password){
            res.json(database.users[0])
        } else {
            res.status(400).json('error logging in');
        }
    // }
})

app.post('/register', (req, res) => {
    const { email, password, name} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('emial')
        .then(loginEmail => {
            return db('users')
            .returning('*')
            .insert({
            email: email,
            name: name, 
            joined: new Date()
            })
        })
    })    
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not Found');
        }
    })
    .catch(err => res.status(400).json('error getting user'));
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // console.log(hash)
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log('app is running on 3000')
});


/*



res --> this is working
signin --> POST = success/fail
register --> POST = user
profile/:userId  --> GET <-- user
image end point --> PUT  <-- user    
*/