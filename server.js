import express from 'express';
import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
const port = 3000;
const app = express();
const saltRounds = 10;

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bank');
const usersCollection = db.collection('users');

app.use(express.static('public'));
app.use(session({
    resave: false, 
    saveUninitialized: false,
    secret: 'shhhh, very secret',
    }));
    
app.use(express.json());

const restrict = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

app.get('/api/user',restrict, (req, res) => {
      res.json({
        user: req.session.user
      });
   });

app.post('/api/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRounds)
    await usersCollection.insertOne({
      user: req.body.user,
      password: hash,
      accounts: []
    });

    res.json({
      success: true,
      user: req.body.user
    })
})

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
      res.json({
      loggedin: false
      });
  });
});
   

app.post('/api/login', async (req, res) => {
    const user = await usersCollection.findOne({ user: req.body.user });
    if(user){
      const passwordMatches = await bcrypt.compare(req.body.password, user.password)
      if (user && passwordMatches) {
      req.session.user = user;
      res.json({
        user: user.user
      });
    } 
      else { 
        res.status(401).json({ error: 'Unauthorized'});
      }
    }

    else{
      res.status(401).json({ error: 'user does not exist'});
    }
  });

app.put('/api/user/:id', restrict, async (req, res) => {
    req.body.accounts.number = uuidv4();
    await usersCollection.updateOne({ _id: ObjectId(req.params.id)}, { $push: req.body });
    const user = await usersCollection.findOne({ _id: ObjectId(req.params.id) });
    req.session.user = user
    res.json({
        user: user.user
    });
})

app.put('/api/user/:id/account', restrict, async (req, res) => {
    await usersCollection.updateOne(
        { _id: ObjectId(req.params.id) }, 
        { $pull: req.body }
    );
    const user = await usersCollection.findOne({ _id: ObjectId(req.params.id) });
    req.session.user = user
    res.json({
      user: user.user
  });
})

app.put('/api/user/:id/transaction', restrict,  async (req, res) => {
    await usersCollection.updateOne(
    { _id: ObjectId(req.params.id), "accounts.number": req.body.accounts.number },
    { $set: { "accounts.$.balance": req.body.accounts.balance } }
    )
    const user = await usersCollection.findOne({ _id: ObjectId(req.params.id) });
    req.session.user = user
  res.json({
      user: user.user
  });
})

app.listen(port, () => console.log(`listening on port ${port}`))