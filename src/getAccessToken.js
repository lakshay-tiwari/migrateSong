require('dotenv').config();
const axios = require('axios');
const updateEnvVariable = require('./updateEnvVariable');
const express = require('express');
const querystring = require('querystring');

const client_id = process.env.CLIENT_ID;
let redirect_uri = 'http://127.0.0.1:8888/callback'; // add this uri to your spotify app
const client_secret = process.env.CLIENT_SECRET;

let app = express();
const port = process.env.PORT || 8888;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


app.get('/login', function(req, res) {
  let state = generateRandomString(16);
  let scope = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-read-private',
    'user-read-email'
  ].join(' ');

  
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/callback',async function(req, res) {

  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        }
      }
    );
    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;
    updateEnvVariable('SPOTIFY_ACCESS_TOKEN',access_token);
    updateEnvVariable('SPOTIFY_REFRESH_TOKEN', refresh_token);
  }
});


app.listen(port,()=>{
  console.log(`Server is running : ${port}`);
})