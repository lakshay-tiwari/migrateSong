const fs = require('fs');
const { addPlaylist, addSongToPlaylist } = require('../apifunctions/youtubeAPIFunc');
const youtubeMappedFile = './youtubeTracks.json';

async function createAndPopulatePlaylists() {
    if (!fs.existsSync(youtubeMappedFile)) {
        console.log('⚠️ YouTube tracks file not found!');
        return;
    }

    const youtubeData = JSON.parse(fs.readFileSync(youtubeMappedFile, 'utf-8'));

    for (const playlist of youtubeData) {
        const { playlistName, videoIds } = playlist;
        try {
            const playlistId = await addPlaylist(playlistName, 'Migrated from Spotify');
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
}


module.exports = createAndPopulatePlaylists;