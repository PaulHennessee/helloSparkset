import * as Msal from "msal";
import {getUser, user } from "./graph.js";

//msal values here
const msalConfig = {
  auth: {
    clientId: "Y9854a95e-b54f-408c-ade5-9971c3f07970", //remember to change this 
    redirectUri: "http://localhost:8080"
  }
};

const msalRequest = {
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
  ]
}

// Create the main MSAL instance
// configuration parameters are located in config.js
const msalClient = new Msal.UserAgentApplication(msalConfig); //changed this from publicuser

let account = null;


async function signIn() {
    // Login
    try {
      // Use MSAL to login
      const authResult = await msalClient.loginPopup(msalRequest);
      // take this out after testing
      console.log('id_token acquired at: ' + new Date().toString()); 
      // Save the account username, needed for token acquisition
      sessionStorage.setItem('msalAccount', authResult.account.username);
  
      // Get the user's profile from Graph
      user = await getUser();
      // Save the profile in session
      sessionStorage.setItem('graphUser', JSON.stringify(user));
      //updatePage(Views.home);                                // update in vue component
    } catch (error) {
      console.log(error);
      //updatePage(Views.error, {                              // update in vue component
        //message: 'Error logging in',
        //debug: error
     // });
    }
}



async function getToken() {
    account = sessionStorage.getItem('msalAccount'); //changed from let account
    if (!account){
      throw new Error(
        'User account missing from session. Please sign out and sign in again.');
    }
  
    try {
      // First, attempt to get the token silently
      const silentRequest = {
        scopes: msalRequest.scopes,
        account: msalClient.getAccountByUsername(account)
      };
  
      const silentResult = await msalClient.acquireTokenSilent(silentRequest);
      return silentResult.accessToken;
    } catch (silentError) {
      // If silent requests fails with InteractionRequiredAuthError,
      // attempt to get the token interactively
      if (silentError instanceof Msal.InteractionRequiredAuthError) {
        const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
        return interactiveResult.accessToken;
      } else {
        throw silentError;
      }
    }
}

function signOut() {
  account = null;
  sessionStorage.removeItem('graphUser');
  msalClient.logout();
}

export default {signIn, signOut, getToken}; 
