const express = require("express");
const AV = require("leanengine");
const path = require("path");
require("./cloud");

require('dotenv').config({ path: './config.env' }); //we added this
console.log(process.env.MSAL_CLIENT_ID);
// const msalConfig = {
//     auth: {
//       clientId: process.env.MSAL_CLIENT_ID, //changed to sparkset
//       redirectUri: "http://localhost:8080",               //remember to change this on live site
//       postLogoutRedirectUri: "https://admin.hellosparkset.com/settings"
//     }
// };
// const msalRequest = {
// scopes: [
//     'user.read',
//     'mailboxsettings.read',
//     'calendars.readwrite'
// ]
// };

const app = express();
app.use(AV.express());
app.enable("trust proxy");
app.use(AV.Cloud.HttpsRedirect());
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});

exports.app = app;          // same as module.exports = app 
// exports.msalConfig = msalConfig;
// exports.msalRequest = msalRequest;