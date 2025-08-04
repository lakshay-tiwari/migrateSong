const fs = require('fs');
const { getTracks , getSpotifyPlaylist } = require('../apifunctions/spotifyAPIFunc');
const filePath = './spotifyTracks.json';

async function spotifyWork(){ // it save spotify playlist in data.json file
    const allPlaylistMap = new Map();
    const finalList = [];
    const allPlaylistArr = await getSpotifyPlaylist();

    allPlaylistArr.forEach((element)=>{
        const id = element.id;
        const name = element.name;
        allPlaylistMap.set(id,name);
    })

    for (let [id,name] of allPlaylistMap){
        const allTracks = await getTracks(id);
        finalList.push({
            playlistName: name,
            tracks: allTracks
        })
    }

    fs.mkdirSync('./', { recursive: true }); 
    fs.writeFileSync(filePath,JSON.stringify(finalList,null,2));
    console.log("Saved Playlist to data.json");

}

module.exports = spotifyWork;