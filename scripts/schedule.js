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
    let alreadyExpired = [];
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
            //NOT WORKING
        } else if (expirationDate < dateToday) {
            alreadyExpired.push(item);
        }
    });
    return [todayExpire, tomorrowExpire, weekExpire, alreadyExpired];

};

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cs546spoileralert@gmail.com',
        pass: 'spoilerAlertcs546'
    }
});

var generateEmail = function (todayExpire, tomorrowExpire, weekExpire, alreadyExpired, toEmail){

    let todayExpireString = todayExpire.map(function(a) {return a.nickname;}).join(', ');
    let tomorrowExpireString = tomorrowExpire.map(function(a) {return a.nickname;}).join(', ') ;
    let weekExpireString = weekExpire.map(function(a) {return a.nickname;}).join(', ');
    let alreadyExpiredString = alreadyExpired.map(function(a) {return a.nickname;}).join(', ');
   
    todayExpireString = !!todayExpireString ? todayExpireString : "None";
    tomorrowExpireString = !!tomorrowExpireString ? tomorrowExpireString : "None";
    weekExpireString= !!weekExpireString ? weekExpireString: "None";
    alreadyExpiredString= !!alreadyExpiredString ? alreadyExpiredString: "None";


    todayExpireString = '<p>Expires today: ' + todayExpireString.toString() + '</p>';
    tomorrowExpireString = '<p>Expires tomorrow: ' + tomorrowExpireString.toString() + '</p>';
    weekExpireString = '<p>Expires within 7 days: ' + weekExpireString.toString() + '</p>';
    alreadyExpiredString = '<p>Please remove/delete these expired foods: '+ alreadyExpiredString.toString() + '</p>';
    let reportString = '<p> Here is your daily update from Spoiler Alert: </p>' + todayExpireString + tomorrowExpireString + weekExpireString + alreadyExpiredString;
    
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
                        generateEmail(resultItems[0], resultItems[1], resultItems[2], resultItems[3], currUser.profile.email);
                    });
                });
            });
            console.log("Sent email reports to all users");
        });
    }
}

