const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();

// middlewares
app.use(express.json()); /* will allow us to grab the body as an object during post request */

// connecting to db
let db;
connectToDb((err) => {
    if(!err) {
        app.listen(3000, ()=> console.log('connected'));
        db = getDb();
    }
})

// routes
// get all books
app.get('/blogs', (req, res) => {
    // pagination
    const page = req.query.pages || 0
    const blogsPerPage = 2

    // 
    let blogs = [];

    db.collection('blogs')
    .find()
    .sort({ createdAt: -1})
    .skip(page * blogsPerPage) /* pagination */
    .limit(blogsPerPage) /* pagination */
    .forEach(blog => blogs.push(blog))
    .then(() => res.status(200).json(blogs))
    .catch(() => res.status(500).json({error: "Server error"}));
});

// get one book
app.get('/blogs/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('blogs')
        .findOne({_id: new ObjectId(req.params.id)})
        .then( doc => res.status(200).json(doc))
        .catch(err => res.status(500).json({error: 'could not fetch the document'}));
    } else {
        res.status(500).json({error: 'not a valid document'})
    }
});

// posting books
app.post('/blogs', (req, res) => {
    const blog = req.body;
    db.collection('blogs')
    .insertOne(blog)
    .then( result => res.status(201).send(result))
    .catch( err => res.status(500).json({error: 'Could not create'}));
});

// deleting books
app.delete('/blogs/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('blogs')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).json({error: 'could not delete'}))
    } else {
        res.status(500).json({error: 'invalid object id'})
    }
})

// patch request on the books
app.patch('/blogs/:id', (req, res) => {
    const updates = req.body;

    if(ObjectId.isValid(req.params.id)) {
        db.collection('blogs')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).json({error: 'could not update document'}))
    } else {
        res.status(500).json({error: 'invalid document id'})
    }
})