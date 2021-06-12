const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//the route
//the get() method requires 2 arguments. 
  //first a string that describes the route the client will have to fetch from
  //second a callback function that will execute every time that route is accessed with a GET request
//res object is short for response.
//req object is short for request
router.get('/animals', (req, res) => {
    let results = animals;
    //console.log(req.query)
    //req.query is multifaceted, often combing multiple parameters
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    //.json() is so we can send lots of JSON. This also changes the headers(i.e, additional metadata that's sent with every request/response) 
        //so that client knows it's receiving JSON
    res.json(results);
});
    //use the send() method to send the string Hello! to our client
    //res.send('Hello!');
//     res.json(animals);
//   });

// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
//   });

router.get('/animals/:id', (req, res) => {
    //req.param is specific to a single property often intended to retrieve a single record
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//post method is another method of the app object that allows us to create routes
  //they represent the action of a client requesting the server to accept data rather than the other way around
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // req.body is where our incoming content will be
    //using console.log to view the data we're posting to the server
    //console.log(req.body);

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        //using res.json to send the data back to the client
        //res.json(req.body);
        res.json(animal);
    }
});

module.exports  = router;