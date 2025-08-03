require('dotenv').config();
const axios = require('axios');
const access_token = process.env.SPOTIFY_ACCESS_TOKEN;
const playListIdMap = new Map(); // map all playlist id -> name 
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

async function mapping(){
  const res = await getSpotifyPlaylist(access_token);
  res.forEach(element => {
    const id = element.id ;
    const name = element.name;
    playListIdMap.set(id,name);
  })
}

mapping().then(()=>{
  console.log("map entries: ");
  for (let [key,value] of playListIdMap){
    console.log(key + " " + value);
  }
});


module.exports = { getSpotifyPlaylist , playListIdMap }