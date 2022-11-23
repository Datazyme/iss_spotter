const {nextISSTimesForMyLocation } = require('./iss');
//prints out the times and date in readable format as a sentence
const printPassedTimes = function(passTimes) {
  for (let pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass is on ${datetime} for ${duration} seconds`)
  }
}
//uses function to let you know if it workd or there is an error
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  printPassedTimes(passTimes);
});

/* Expected output 
Next pass is at Thu Nov 24 2022 00:07:17 GMT+0000 (Coordinated Universal Time) for 571 seconds
Next pass is at Thu Nov 24 2022 10:13:57 GMT+0000 (Coordinated Universal Time) for 233 seconds
Next pass is at Thu Nov 24 2022 20:20:37 GMT+0000 (Coordinated Universal Time) for 240 seconds
Next pass is at Fri Nov 25 2022 06:27:17 GMT+0000 (Coordinated Universal Time) for 574 seconds
Next pass is at Fri Nov 25 2022 16:33:57 GMT+0000 (Coordinated Universal Time) for 596 seconds*/

