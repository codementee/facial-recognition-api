const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors())
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
    ], 
    login: [
        {
            id: '321',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
	console.log(database.users)
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    for(let i = 0; i < database.users.length; i++) {
        if(req.body.email.toLowerCase() === database.users[i].email.toLowerCase() && req.body.password === database.users[i].password){
            res.json('success')
        } else {
            res.status(400).json('error logging in');
        }
    }
})

app.post('/register', (req, res) => {
    const { email, password, name} = req.body;
    database.users.push({
            id: '124',
            name: name, 
            email: email,
            password: password,
            entries: 0,
            joined: new Date()  
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach((user) => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
       
    if(!found){
        res.status(404).json('no such user');
    }
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach((user) => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(404).json('no such user');
    }
})


bcrypt.hash("bacon", null, null, function(err, hash) {
    // console.log(hash)
});

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