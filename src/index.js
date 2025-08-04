const createAndPopulatePlaylists = require('./works/createAndPopulatePlaylists');
const searchAndStoreVideoIds = require('./works/searchAndStoreVideoIds');


// another method 
async function runYouTubeSyncWorkflow() {
  await searchAndStoreVideoIds();
  await createAndPopulatePlaylists();
}
