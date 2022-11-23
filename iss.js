const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

//A callback (to pass back an error or the IP string)
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    //error can be set if invalid domain, user if offline, etc. An error, if any (nullable)
    if (error) return callback(error, null);
    //checks if non-200, assume server error
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCose} when fetchin IP: ${body}`), null);
      return;
    }
    //parses the body for the ip key.The IP address as a string (null if error).
    const ip = JSON.parse(body).ip;
    callback(null, ip);

  });
};

// iss.js
/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
//Function takes the ip (ipv4) address (string) from previous function
const fetchCoordsByIp = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    //error can be set if invalid domain, user if offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    const data = JSON.parse(body);
    //error if fetching data was not a success
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }
    //returns coordinates in an object with latitude and longitude as keys and the numbers as values
    const {latitude, longitude} = data;
    callback(null,{latitude, longitude});
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
//Function takes an object with keys `latitude` and `longitude` from previous function
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
  //error can be set if invalid domain, user if offline, etc.  
  if (error) {
      callback(error, null);
      return;
    }
   //checks if non-200, assume server error
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCose} when fetchin IP: ${body}`), null);
      return;
    }
    //Returns the fly over times as an array of objects (null if error). Example:[ { risetime: 134564234, duration: 600 }, ... ]
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};
// iss.js 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]*/

 const nextISSTimesForMyLocation = function(callback) {
  //callback each function as part of the previous one.
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    //function has results of previous function (ip) then error then the new thing to find (coordinates)
    fetchCoordsByIp(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }
      //function has results of previous function (coordinates) then error then the new thing to find (passes)
      fetchISSFlyOverTimes(coords, (error, passes) => {
        if (error) {
          return callback(error, null);
        }
        //have to put null or you get the array of object keys:risetime and duration.
        callback(null, passes);
      });
    });
  });  
}

module.exports = {nextISSTimesForMyLocation};