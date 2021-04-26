module.exports = {
    msalConfig: {
        auth: {
        clientId: process.env.VUE_APP_MSAL_CLIENT_ID, //changed to sparkset
        redirectUri: 'http://localhost:8080',               //remember to change this on live site
        postLogoutRedirectUri: 'https://admin.hellosparkset.com/settings'
        }
    },
    msalRequest: {
        scopes: [
            'user.read',
            'mailboxsettings.read',
            'calendars.readwrite'
        ]
    }
};