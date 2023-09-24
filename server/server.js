//budget api

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

//app.use('/Reshma', express.static('public'));
app.use(cors());

const budget = {
  mybudget: [
    {
      title: 'Eat out',
      budget: 30
    },
    {
      title: 'Rent',
      budget: 400
    },
    {
      title: 'Groceries',
      budget: 90
    },
  ]
};

//app.get('/',(req, res) => {
// res.send('Hello World!')
//});

app.get('/budget01', (req, res) => {
  res.json(budget);
});
//fetching the json file into server.js file

//fetch('C:\Users\dudip\NBAD\week03\personal-budget1\budget.json')
//.then(data =>{
//console.log(data);
//});
//const data = require('./data.json');

/*const fs = require('fs');

// Read the JSON file
fs.readFile('budget.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    // Now you can work with the jsonData object
    console.log(jsonData);
    const bdata = jsonData;
    app.get('/budget01',(req, res) => {
        res.json(bdata);
    });
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
});
 
*/
app.listen(port, () => {
  console.log(' app serving at http://localhost:3000');
});