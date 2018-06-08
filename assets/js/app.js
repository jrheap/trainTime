// API for the firebase
var config = {
    apiKey: "AIzaSyD_clwlr3Bdkyp4ehFgGVTWKRnJIFS3LMA",
    authDomain: "train-time-d61af.firebaseapp.com",
    databaseURL: "https://train-time-d61af.firebaseio.com",
    projectId: "train-time-d61af",
    storageBucket: "train-time-d61af.appspot.com",
    messagingSenderId: "206094315985"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
// Making sure that app.js is linked correctly
  console.log("test")

// on click function for the Submit btn
$("#submitBtn").on("click", function(){
  event.preventDefault();
  console.log("The Btn works!")

  // local variables
  var trainName = "";
  var dest = "";
  var fre = 0;
  // This variable will be the start of all of the momnent.js
  var firstTrain = 0;
  // Going to be the variables that we will access/change with moment.js
//  this is going to be confusing i think 
  var arrivalTime = 0;
  var minuteAway = 0;

  
  // grab the values of each input and store them in a variable 
  trainName = $("#trainName").val();
  console.log(trainName);
  dest = $("#destination").val();
  console.log(dest);
  firstTrain = $("#trainTime").val();
  console.log(firstTrain);
  fre = $("#freq").val();
  console.log(fre);


//  Next step is to store them on the firebase
database.ref().push({
 Train: trainName,
 Destination: dest,
 First_train_time: firstTrain,
 Frequency: fre,
})

// once the button get clicks it empties out all of the inputs
var form = document.getElementById("myForm");
    form.reset();
})
// Next we need to grab what is stored in the firebase and create the table with the info

  database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val().Destination, snapshot.val().First_train_time, snapshot.val().Frequency, snapshot.val().Train);
    // Assumptions
    var tFrequency = snapshot.val().Frequency;
    // Time is 3:30 AM
    var firstTime = snapshot.val().First_train_time;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextTrainArival = moment(nextTrain).format("hh:mm")
  
  
  
    var newRow = $("<tr id='" + snapshot.val().Train + "'>")
    newRow.prepend("<td>" + snapshot.val().Train + "</td>" + "<td>" + snapshot.val().Destination + "</td>" + "<td>" + snapshot.val().Frequency + "</td>" + "<td>" + nextTrainArival + "</td>" +
    "<td>" + tMinutesTillTrain + "</td>" + "<td button id='delete' data-train='" + snapshot.val().Train + "'>X</td>");
  // "<td>" + snapshot.val().First_train_time + "</td>"
    $("tbody").prepend(newRow);
  });
  
  $('.table').on('click', '#delete', function(event){
    event.preventDefault()
    console.log("clicked");
    var trainName = $(this).attr('data-train') 
    console.log(trainName);
    database.ref().child(trainName).removevalue()
  })


  

