const { nextISSTimesForMyLocation } = require('./iss_promised');
const {printPassedTimes} = require('./index')

// see index.js for printPassTimes 
// copy it from there, or better yet, moduralize and require it in both files

// Call 
// this is not working. Then is not accepted. 
//Was not working because I did not read the instructions correctly. Silly girl. See not in iss_promised 
nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassedTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
 