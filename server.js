const fs = require('fs');
//module built in the Node.js API that provides utilities for working with file and directory paths
  //it makes working with our file system more predictable
const path = require('path');
const express = require('express');
//require the data
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware functions can serve many purposes but ultimately they allow us to keep our route endpoint callback functions more readable 
  //while letting us reuse functionality across routes to keep our code DRY
//express.static method provided a file path to a location in our application
app.use(express.static('public'));
  // parse incoming string or array data
  //express.urlencoded({ extend: true }) method is a built in Epress.js method
    //it takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

//a function to handle different kinds of queries
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = []; 
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  //console.log(body);
  // our function's main code will go here!
  const animal = body;
  animalsArray.push(animal);
  //writeFileSync is a synchronous version of writeFile and doesn't require a callback function
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    //JSON.stringify converts the JavaScript array data as JSON
    //null and 2 are means of keeping our data formatted
    //null argument means we don't want to edit any of our existing data
    //2 indicates we want to create white space between our values to make it mor readable
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
    //return body;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

//the route
//the get() method requires 2 arguments. 
  //first a string that describes the route the client will have to fetch from
  //second a callback function that will execute every time that route is accessed with a GET request
//res object is short for response.
//req object is short for request
app.get('/api/animals', (req, res) => {
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

app.get('/api/animals/:id', (req, res) => {
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
app.post('/api/animals', (req, res) => {
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//the * will act as a wildcard, 
  //meaning any route that wasn't previously defined will fall under this request and will receive the hompage as the response.
  //the order of routes matters!
    //the * route should always come last or it will take precendence over named routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
