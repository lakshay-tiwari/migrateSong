require('dotenv').config();
const axios = require('axios');
const access_token = process.env.SPOTIFY_ACCESS_TOKEN;

async function getSpotifyPlaylist(access_token) {
  let allPlaylists = [];
  let url = 'https://api.spotify.com/v1/me/playlists';

  try {
    while (url) {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      allPlaylists.push(...response.data.items);
      url = response.data.next; // pagination
    }
    console.log(allPlaylists);
    return allPlaylists;
  } catch (error) {
    console.error('Error fetching playlists:', error.response?.data || error.message);
    return [];
  }
}


// const getTracks = async ()=>{
//     const response = await axios.get('https://api.spotify.com/v1/playlists/2ZxIX6ou57UDhDA8TCJhHa/tracks', {
//         headers:{
//             Authorization: `Bearer ${access_token}`
//         }
//     })
//     console.log(response.data.items[0].track.album.name);
// }

// getTracks();

module.exports = getSpotifyPlaylist 