const cron = require('node-cron');
const nodemailer = require('nodemailer');
const data = require('../data');
const usersData = data.users;
const itemsData = data.items;
const productsData = data.products;

let dateToday = new Date()
let dateTomorrow = new Date();
let dateWeekAway = new Date();
dateTomorrow.setDate(dateTomorrow.getDate() + 1);
dateWeekAway.setDate(dateWeekAway.getDate() + 5);
dateToday = dateToday.getDate();
dateTomorrow = dateTomorrow.getDate();
dateWeekAway = dateWeekAway.getDate();

var calculateExpireItems = function (listItems) {
    let weekExpire = [];
    let todayExpire = [];
    let tomorrowExpire = [];
    listItems.forEach(function (item) {
        let expiration = item.date_of_expiration.split("-");
        expiration = new Date(expiration[2], expiration[0] - 1, expiration[1]);
        let expirationDate = expiration.getDate();
        if (expirationDate + 1 == dateTomorrow) {
            tomorrowExpire.push(item);
        } else if (expirationDate =  dateToday) {
            todayExpire.push(item);
        } else if (expirationDate < dateWeekAway && expirationDate > dateToday) {
            weekExpire.push(item);
        } 
    });
    return [todayExpire, tomorrowExpire, weekExpire];

};

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cs546spoileralert@gmail.com',
        pass: 'spoilerAlertcs546'
    }
});

var generateEmail = function (todayExpire, tomorrowExpire, weekExpire, toEmail){

    let todayExpireString = todayExpire.map(function(a) {return a.nickname;}).join(', ');
    let tomorrowExpireString = tomorrowExpire.map(function(a) {return a.nickname;}).join(', ') ;
    let weekExpireString = weekExpire.map(function(a) {return a.nickname;}).join(', ');

    todayExpireString = !!todayExpireString ? todayExpireString : "None";
    tomorrowExpireString = !!tomorrowExpireString ? tomorrowExpireString : "None";
    weekExpireString= !!weekExpireString ? weekExpireString: "None";
   
    todayExpireString = 'Expires today: ' + todayExpireString.toString() + '</p>';
    tomorrowExpireString = 'Expires tomorrow: ' + tomorrowExpireString.toString() + '</p>';
    weekExpireString = 'Expires within 7 days: ' + weekExpireString.toString() + '</p>';

    let reportString = '<p> Here is your daily update from Spoiler Alert: </p>' + todayExpireString + tomorrowExpireString + weekExpireString;
    let mailOptions = {
        from: '"Spoiler Alert Team" <cs5s46spoileralert@gmail.com>',
        to: toEmail,
        subject: "Your daily report",
        text: reportString
    };
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            callback(null, error);
        } else {
            callback(response);
        }
    });
};

module.exports = {
    simpleTask: function () {
        cron.schedule('*/1 * * * *', function () {
            return usersData.getAllUsers().then((allUsers) => {
                var sequence = Promise.resolve();
                allUsers.forEach(function (currUser) {
                    sequence = sequence.then(function () {
                        return itemsData.getAllItems(currUser._id)
                    }).then(function (itemList) {
                        resultItems = calculateExpireItems(itemList);
                        generateEmail(resultItems[0], resultItems[1], resultItems[2], currUser.profile.email);
                    });
                });
            });
            console.log("Sent email reports to all users");
        });
    }
}

