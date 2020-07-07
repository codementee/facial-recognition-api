const knex = require('knex');

const db = knex({
    client: 'pg',
  connection: {
   connectionString: process.env.DATABASE_URL,
   ssl: true
  }
  });

const handleSignin = (req, res, bcrypt) => {

    if(!req.body.email || !req.body.password) {
        return res.status(400).json('incorrect form submission')
}

    db.select('email', 'hash').from('login').where('email', '=', req.body.email)

    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // true
        if(isValid) {
            return db.select('*').from('users').where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
    handleSignin
};