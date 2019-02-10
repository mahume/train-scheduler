// Initialize Firebase
var config = {
    apiKey: "AIzaSyAjSiHWIE1HxFXeMCl7uwx6hSOp83fkbTs",
    authDomain: "train-scheduler-c339c.firebaseapp.com",
    databaseURL: "https://train-scheduler-c339c.firebaseio.com",
    projectId: "train-scheduler-c339c",
    storageBucket: "train-scheduler-c339c.appspot.com",
    messagingSenderId: "903861576972"
};
firebase.initializeApp(config);
let database = firebase.database();
let firstTrain, frequency, currentTime, firstTrainConverted, timeDiff, remainder, minutesAway, nextArrival;

// Submit data to Firebase
$('#submitButton').on('click', function(event) {
    event.preventDefault();
    // Assigning variables from form
    let name = $("#trainNameInput").val().trim();
    let destination = $("#destinationInput").val().trim();
    firstTrain = $("#firstTrainInput").val().trim();
    frequency = parseInt($("#frequencyInput").val().trim());
    // Add info to firebase DB
    database.ref().set({
        trainName: name,
        trainDestination: destination,
        firstTrainTime: firstTrain,
        trainFrequency: frequency
    });
    // Clear form
    $('#trainInputForm').trigger('reset');
});

// Firebase auto loader
database.ref().on("value", function(snapshot) {
    // Creating elements for DOM
    let trainScheduleTable = $('#trainDataDisplay');
    let inputTR = $('<tr>');
    let nameTD = $('<td>');
    let destinationTD = $('<td>');
    let frequencyTD = $('<td>');
    let nextArrivalTD = $('<td>');
    let minutesAwayTD = $('<td>');
    $(trainScheduleTable).append(inputTR);
    $(inputTR).append(nameTD);
    $(inputTR).append(destinationTD);
    $(inputTR).append(frequencyTD);
    $(inputTR).append(nextArrivalTD);
    $(inputTR).append(minutesAwayTD);
    // Run calculations
    firstTrain = snapshot.val().firstTrainTime;
    frequency = snapshot.val().trainFrequency;
    currentTime = moment().format("HH:mm");
    firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, 'years');
    timeDiff = moment().diff(moment(firstTrainConverted), 'minutes');
    remainder = timeDiff % frequency;
    minutesAway = frequency - remainder;
    nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
    // Add to DOM
    $(nameTD).text(snapshot.val().trainName);
    $(destinationTD).text(snapshot.val().trainDestination);
    $(frequencyTD).text(snapshot.val().trainFrequency);
    $(nextArrivalTD).text(nextArrival);
    $(minutesAwayTD).text(minutesAway);
    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});