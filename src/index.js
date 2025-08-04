const fs = require('fs');
const { getTracks , getSpotifyPlaylist } = require('./spotify');
const filePath = './src/data.json';
const { searchSong , addSongToPlaylist , addPlaylist } = require('./youtube');

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

    fs.mkdirSync('./src', { recursive: true }); 
    fs.writeFileSync(filePath,JSON.stringify(finalList,null,2));
    console.log("Saved Playlist to data.json");

}

async function youtubeWork(){  // it create playlist and add tracks to it
    if (!fs.existsSync(filePath)){
        console.log('⚠️ File does not exist:', filePath);
    }
    const tracksArray = fs.readFileSync(filePath,'utf-8'); // array
    const allTracksPlaylist = JSON.parse(tracksArray);

    allTracksPlaylist.forEach(element => {
        console.log(element);
        console.log(`@@@@@@@@@@@@@@@@`);
    })
}
