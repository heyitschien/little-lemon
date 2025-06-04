/*
  Mock API for Little Lemon booking system.
  This script mimics the behavior of the Coursera-provided api.js,
  but ensures functions are globally available on the window object
  for local development and testing.
*/

const seededRandom = function (seed) {
    var m = 2**35 - 31;
    var a = 185852;
    var s = seed % m;
    return function () {
        return (s = s * a % m) / m;
    };
}

window.fetchAPI = function(date) {
    let result = [];
    // Ensure 'date' is a Date object before calling getDate()
    let validDate = date instanceof Date ? date : new Date(date);
    let random = seededRandom(validDate.getDate());

    for(let i = 17; i <= 23; i++) {
        if(random() < 0.5) {
            result.push(i + ':00');
        }
        if(random() < 0.5) {
            result.push(i + ':30');
        }
    }
    return result;
};

window.submitAPI = function(formData) {
    // Simulate a successful submission
    console.log("Mock API submitted form data:", formData);
    return true;
};

console.log("mockApi.js loaded and functions attached to window.");
