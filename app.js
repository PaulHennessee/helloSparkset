const express = require("express");
const AV = require("leanengine");
const path = require("path");
require("./cloud");
const app = express();
app.use(AV.express());
app.enable("trust proxy");
app.use(AV.Cloud.HttpsRedirect());
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
module.exports = app;


//msal values here??? yes
const msalConfig = {
  auth: {
    clientId: 'YOUR_APP_ID_HERE', //remember to change this 
    redirectUri: 'http://localhost:8080'
  }
};

const msalRequest = {
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
  ]
}