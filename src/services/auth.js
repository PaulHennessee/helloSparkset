import * as Msal from "@azure/msal-browser";
import {getUser} from "./graph.js";  
// const {msalConfig, msalRequest} = require("../../app");

const msalConfig = {
  auth: {
    clientId: process.env.MSAL_CLIENT_ID, //changed to sparkset
    redirectUri: "http://localhost:8080",               //remember to change this on live site
    postLogoutRedirectUri: "https://admin.hellosparkset.com/settings"
  }
};
const msalRequest = {
scopes: [
  'user.read',
  'mailboxsettings.read',
  'calendars.readwrite'
]
};

// Create the main MSAL instance
const msalClient = new Msal.PublicClientApplication(msalConfig);

let account = null;
 
export async function signIn() //use this to sign in
{
    // Login
    try {
      // Use MSAL to login
      const authResult = await msalClient.loginPopup(msalRequest);
      // take this out after testing
      console.log('id_token acquired at: ' + new Date().toString()); 
      // Save the account username, needed for token acquisition
      window.localStorage.setItem('msalAccount', authResult.account.username);  
  
      // Get the user's profile from Graph
      let user = await getUser();
      // Save the profile in session
      window.localStorage.setItem('graphUser', JSON.stringify(user));

      console.log(user.userPrincipalName);                      //new
      return user.userPrincipalName;                            //new
    } 
    catch (error) {
        console.log(error);
        return false;                                             //new
    }
    
};

export function getEmail() {
  console.log(account);
  if (account) {
    return account;
  }
  else {
    console.log("No account signed in.");
    return false;
  }
};

export async function getToken() //only used in graph.js
{
    console.log("in getToken");
    account = window.localStorage.getItem('msalAccount'); //changed from let account
    if (!account) {
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
};

export function signOut() //use this to sign out
{
  account = null;
  window.localStorage.removeItem('graphUser');
  msalClient.logout();
};