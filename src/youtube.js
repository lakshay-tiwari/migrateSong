require('dotenv').config();
const axios = require('axios');
const apiKey = process.env.GOOGLE_API_KEY;

const access_token = process.env.GOOGLE_ACCESS_TOKEN;

// this search the song 
async function searchSong(q){  // query, 2, relevance
    try {
      const url = 'https://www.googleapis.com/youtube/v3/search';
      const response = await axios.get(url,{
          headers: {
              Authorization: `Bearer ${access_token}`
          },
          params: {
              "part": "snippet",
              "maxResults": 1 ,
              "order": 'relevance',
              "q" : q,
              "safeSearch": "none",
              'type': 'video'
          }
      })
      console.log(response.data.items);
      return response.data.items;
    } catch (error) {
      console.log(error);
      return [];
    }
}


// create playlist on account
async function addPlaylist(title,description){
    const playlist = {
        snippet: {
            title: title,
            description: description
        },
        status: {
            privacyStatus: 'private'
        }
    }
    try{
        const response = await axios.post(`https://youtube.googleapis.com/youtube/v3/playlists?key=${apiKey}`,playlist,{
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                },
                params: {
                    part: 'snippet,status'
                }
            }
        )
        console.log(response.data.id);
        return response.data.id;
    } catch(e){
        console.log("error occurs");
        console.log(e);
        console.log('error!!');
        return null;
    }
}


// add song to the playlist 
async function addSongToPlaylist(playlistId, videoId) {
  try {
    const response = await axios.post(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet`,
      {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId: videoId
          }
        }
      },
      {
        params: {
            part: 'snippet'
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        }
      }
    );

    console.log("Video added successfully:", response.data);
  } catch (error) {
    console.error("Failed to add video to playlist:", error.response?.data || error.message);
  }
}

module.exports = { searchSong , addSongToPlaylist , addPlaylist }