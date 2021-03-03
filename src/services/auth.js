import * as Msal from "@azure/msal-browser";
import {getUser, user} from "./graph.js";  //might cause problems 

const msalConfig = {
  auth: {
    clientId: "9cad936f-afe6-467e-b618-90474ae0f152", //remember to change this to sparkset
    redirectUri: "http://localhost:8080"
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
// configuration parameters are located in config.js
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
      sessionStorage.setItem('msalAccount', authResult.account.username);     

      // ***** sessionStorage is where they are saving information.might have to change *******

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
};

export async function getToken() //only used in graph.js
{
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
};

export function signOut() //use this to sign out
{
  account = null;
  sessionStorage.removeItem('graphUser');
  msalClient.logout();
};