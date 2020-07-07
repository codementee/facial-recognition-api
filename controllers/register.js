const knex = require('knex');

const db = knex({
    client: 'pg',
    connectionString: 'postgres://pvdfomwvdjxrey:3d68616fa77b2f687b8996eae5dafba88b79cde9c7db9b2142c267c9dbc0182d@ec2-52-72-221-20.compute-1.amazonaws.com:5432/dev2ipr1f9cp14',
    ssl: {
      rejectUnauthorized: false
    }
  });


const handleRegister = (req, res, bcrypt) => {
    const { email, password, name} = req.body;
    if(!email || !name || !password) {
            return res.status(400).json('incorrect form submission')
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
            email: loginEmail[0],
            name: name, 
            joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .then(trx.rollback)
         })
        .catch(err => res.status(400).json('unable to register'))
  
}

module.exports = {
    handleRegister
};