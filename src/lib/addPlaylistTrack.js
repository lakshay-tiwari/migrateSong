const fs = require('fs');
const filePath = './src/lib/spotifyOne.json';
const { getTracks } = require('../apifunctions/spotifyAPIFunc');

async function addPlaylistTrack(playlistId,name){
    try {
        const allTrack = await getTracks(playlistId);
        const finalStore = {};
        finalStore.playlistName = name;
        finalStore.tracks = allTrack;
        fs.mkdirSync('./src/lib', { recursive: true }); 
        fs.writeFileSync(filePath,JSON.stringify(finalStore,null,2));
        console.log('Save playlist to spotifyOne.json');
    } catch (error) {
        console.log(error);
    }
}
module.exports = addPlaylistTrack;