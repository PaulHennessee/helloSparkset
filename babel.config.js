module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"]
};

const msalConfig = {
  auth: {
    clientId: process.env.MSAL_CLIENT_ID, //changed to sparkset
    redirectUri: "http://localhost:8080",               //remember to change this on live site
    postLogoutRedirectUri: "https://admin.hellosparkset.com/settings"
  }
};
