const fs = require('fs');
const filePath = './spotifyTracks.json';
const { searchSongOnYoutube , addSongToPlaylist , addPlaylist } = require('../apifunctions/youtubeAPIFunc');


// for small playlist do this 
async function youtubeWork() {
    if (!fs.existsSync(filePath)) {
        console.log('⚠️ File does not exist:', filePath);
        return;
    }

    const tracksArray = fs.readFileSync(filePath, 'utf-8');
    const allTracksPlaylist = JSON.parse(tracksArray);

    for (const element of allTracksPlaylist) {
        const playlistName = element.playlistName;
        const tracks = element.tracks;

        const createPlaylistId = await addPlaylist(playlistName, 'Migrate from Spotify');

        for (const el of tracks) {
            try {
                const searchSong = await searchSongOnYoutube(el);
                if (searchSong) {
                    await addSongToPlaylist(createPlaylistId, searchSong);
                } else {
                    console.log(`❌ Song not found: ${el}`);
                }
            } catch (err) {
                console.log(`⚠️ Error adding song "${el}" to playlist:`, err.message);
            }
        }
    }
}

youtubeWork()

module.exports = youtubeWork;