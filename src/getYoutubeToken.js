require('dotenv').config();
const {google} = require('googleapis');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const url = require('url');
const updateEnvVariable = require('./updateEnvVariable');
/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Access scopes for YouTube API
const scopes = [
  'https://www.googleapis.com/auth/youtube'
];

// Generate a secure random state value.

const app = express();
app.use(session({
  secret: 'some-random-secret',   // change in production
  resave: false,
  saveUninitialized: true
}));

app.get('/' , function(req,res){
    const state = crypto.randomBytes(32).toString('hex');
    // Store state in the session
    req.session.state = state;
    
    // Generate a url that asks permissions for the Drive activity and Google Calendar scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
        * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      // Include the state parameter to reduce the risk of CSRF attacks.
      state: state
    });
    res.redirect(authorizationUrl);
})


// Receive the callback from Google's OAuth 2.0 server.
app.get('/callback', async (req, res) => {
  let q = url.parse(req.url, true).query;

  if (q.error) {
    console.log('Error:' + q.error);
    res.end('Error occurred');
  } else if (q.state !== req.session.state) {
    console.log('State mismatch. Possible CSRF attack');
    res.end('State mismatch. Possible CSRF attack');
  } else {
    let { tokens } = await oauth2Client.getToken(q.code);
    const access_token = tokens.access_token;
    updateEnvVariable('GOOGLE_ACCESS_TOKEN',access_token);
    oauth2Client.setCredentials(tokens);
    res.send('Authentication successful!');
  }
}); 


app.listen(3000,()=>{
    console.log('Server is running on port : 3000');
});