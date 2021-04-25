const express = require("express");
require('dotenv').config(); 
const AV = require("leanengine");
const path = require("path");
require("./cloud");

//we added this
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

module.exports = app;          // same as module.exports = app 
// module.exports.msalConfig = msalConfig;
// module.exports.msalRequest = msalRequest;