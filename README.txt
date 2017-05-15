Spoiler Alert!
Created by: Adam Gincel, Matthew Gomez, Neel Patel, and Alex Massenzio

-- I pledge my honor that I have abided by the Stevens Honor System.

SETUP:
1) Make sure you have the following programs installed on your machine:
 - MongoDB (we recommend 3.4): https://www.mongodb.com/
 - NodeJS (with npm): https://nodejs.org/en/download/
2) Go to your installed mongodb folder and run /MongoDB/Server/3.4/bin/mongod.exe
3) Open a command prompt in the root of the SpoilerAlert poject folder.
4) Enter the command "npm install"
5) To run the server, simply enter "npm start"! It can be accessed through a internet browser using localhost:3000

DATABASE:
Seed via "npm run-script seed" or use the database dump found in dump/admin directory

USAGE:
1) Log in or sign up 
    a) Preset 1: cs546janedoe@mailinator.com with password: password
    b) Preset 2: cs546bobross@mailinator.com with password: 1234
2) Logout with button or edit profile
    a) Can visit products page without logging in but cannot add/remove
3) Add item to inventory using blue button on homepage
    a) Add an existing product that is used or add a new item
4) Wait till midnight or set your clock to close to midnight to see items deleted and email sent
    a) or manually set the cron string in scripts/schedule.js to desired time for it to happen (for testing)
        i) Cron string format for: 3:30 PM is '0 30 3 * * *'
5) Enjoy your food before it expires!