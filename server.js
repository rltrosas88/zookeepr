//require the data
const { animals } = require('./data/animals');

const express = require('express');

const app = express();

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

//the route
//the get() method requires 2 arguments. 
  //first a string that describes the route the client will have to fetch from
  //second a callback function that will execute every time that route is accessed with a GET request
//res object is short for response.
//req object is short for request
app.get('/api/animals', (req, res) => {
    let results = animals;
    //console.log(req.query)
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

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });

