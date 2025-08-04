const fs = require('fs');
const { searchSongOnYoutube } = require('../apifunctions/youtubeAPIFunc');
const filePath = './src/lib/spotifyOne.json';
const outPath = './src/lib/ytOne.json';

async function convertSpotifyToYT(){

    if (!fs.existsSync(filePath)) {
        console.log('⚠️ Spotify file not found!');
        return;
    }

    const spotifyData = JSON.parse(fs.readFileSync(filePath ,'utf-8'));
    const ytVideoJSON = {};
    const videoIds = [];

    ytVideoJSON.name = spotifyData.name;
    const allTracks = spotifyData.tracks;
    for (const track of  allTracks){
        try {
            const videoId = await searchSongOnYoutube(track);
            if (videoId) {
                videoIds.push(videoId);
            }
            else {
                console.log(`❌ No video found for: "${track}"`);
            }
        } catch (error) {
            console.error("Something break");
        }
    }
    ytVideoJSON.tracks = videoIds;
    fs.writeFileSync(outPath,JSON.stringify(ytVideoJSON,null,2));
    console.log('Saved Video ids');

}


async function addTrack(){
    if (!fs.existsSync(outPath)) {
        console.log('⚠️ YouTube tracks file not found!');
        return;
    }

    const youtubeData = JSON.parse(fs.readFileSync(outPath, 'utf-8'));

    const name = youtubeData.name ;
    const videoIds = youtubeData.tracks;
    try {
        const playlistId = await addPlaylist(name, 'Migrated from Spotify');
        console.log(`🎵 Created playlist "${playlistName}"`);

        for (const videoId of videoIds) {
            try {
                await addSongToPlaylist(playlistId, videoId);
            } catch (err) {
                console.log(`⚠️ Error adding video ${videoId} to ${playlistName}:`, err.message);
            }
        }
    } catch (err) {
        console.log(`❌ Failed to create playlist "${playlistName}":`, err.message);
    }
}

module.exports = { convertSpotifyToYT, addTrack };