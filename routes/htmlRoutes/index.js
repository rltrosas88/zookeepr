const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
  
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});
  
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});
  
//the * will act as a wildcard, 
    //meaning any route that wasn't previously defined will fall under this request and will receive the hompage as the response.
    //the order of routes matters!
        //the * route should always come last or it will take precendence over named routes
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;