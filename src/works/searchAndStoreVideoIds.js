const fs = require('fs');
const path = require('path');
const { searchSongOnYoutube } = require('../apifunctions/youtubeAPIFunc'); // adjust import
const spotifyFile = './spotifyTracks.json';
const youtubeMappedFile = './youtubeTracks.json';

async function searchAndStoreVideoIds() {
    if (!fs.existsSync(spotifyFile)) {
        console.log('⚠️ Spotify file not found!');
        return;
    }

    const spotifyData = JSON.parse(fs.readFileSync(spotifyFile, 'utf-8'));
    const youtubeData = [];

    for (const playlist of spotifyData) {
        const { playlistName, tracks } = playlist;
        const videoIds = [];

        for (const track of tracks) {
            try {
                const videoId = await searchSongOnYoutube(track);
                if (videoId) {
                    videoIds.push(videoId);
                } else {
                    console.log(`❌ No video found for: "${track}"`);
                }
            } catch (err) {
                console.log(`⚠️ Error searching "${track}":`, err.message);
            }
        }

        youtubeData.push({ playlistName, videoIds });
    }

    

    fs.writeFileSync(youtubeMappedFile, JSON.stringify(youtubeData, null, 2));
    console.log(`✅ Saved video IDs to ${youtubeMappedFile}`);
}


module.exports = searchAndStoreVideoIds;