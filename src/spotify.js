require('dotenv').config();
const axios = require('axios');
const access_token = process.env.SPOTIFY_ACCESS_TOKEN;

async function getSpotifyPlaylist() {
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
    return allPlaylists;
  } catch (error) {
    console.error('Error fetching playlists:', error.response?.data || error.message);
    return [];
  }
}


const getTracks = async (playlistId)=>{
  let allTracks = [];
  const limit = 100;
  let offset = 0 ;
  let total = 0 ;
  while(true){
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers:{
              Authorization: `Bearer ${access_token}`
          },
          params: {
            limit,
            offset
          }
      })
      const items = response.data.items;
  
      items.forEach(el => {
        const track = el.track;
        if (!track) {
          console.warn('Skipping a null track.');
          return;
        }
        const name = track.album.name;
        allTracks.push(name);
      })
  
      total = response.data.total;
      if (offset + limit >= total) break;
      offset += limit;
    } catch (error) {
      console.log(error);
    }
  }

  return allTracks;
}



module.exports = { getSpotifyPlaylist  , getTracks}


