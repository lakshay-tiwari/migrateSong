# 🎵 Spotify to YouTube Song Migration

This project allows you to **migrate your Spotify playlists to YouTube** automatically using APIs from both platforms.

---

## 🔐 API Setup Instructions

To run this project, you need:

- A **Spotify API Key**
- A **Google OAuth 2.0 Client** (YouTube Data API v3)

---

### 🎧 1. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Log in with your Spotify account.
3. Click **"Create an App"**.
4. Fill in the required fields (App Name, Description).
5. Once created, note down:
   - **Client ID**
   - **Client Secret**
6. You'll use these in your `.env` or token request script.

---

### 📺 2. Enable YouTube Data API v3 (Google Cloud)

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **new project** or select an existing one.
3. Navigate to **“APIs & Services” > “Library”**.
4. Search for **YouTube Data API v3** and click **Enable**.
5. Now go to **“APIs & Services” > “Credentials”**.
6. Click **"Create Credentials" > "OAuth Client ID"**.

#### Configure Consent Screen:

1. Select **External** and click **Create**.
2. Fill in app name, user support email, and developer contact info.
3. Under **Scopes**, click **Add or Remove Scopes** and add:
   - `https://www.googleapis.com/auth/youtube`
4. Under **Test Users**, **add your Gmail address** to test the app.
   - This step is required to test before publishing the app.
5. Save and continue.

#### Create OAuth Client:

1. Select **Application Type**: `Web Application`.
2. Add an **Authorized Redirect URI** like: http://localhost:3000/callback
(You can change this depending on your local server setup.)
3. Once created, you'll receive:
- **Client ID**
- **Client Secret**

---

## 🔑 Step 3: Generate Access Tokens

1. Navigate to the `createToken/` folder.
2. Run the included scripts to initiate OAuth.
3. Authorize the app via your browser.
4. The script will exchange the code for access + refresh tokens.
5. Save these tokens securely.

---

## 🚀 Step 4: Choose a Migration Approach

### ✅ Approach 1: All-in-One Migration

- Get all Spotify playlists.
- Search for each song on YouTube.
- Create new YouTube playlists.
- Add videos automatically.

### 🗃️ Approach 2: Save & Migrate Later (Quota Safe)

- Extract all Spotify songs to a `.json` file (e.g., `spotifyTracks.json`).
- Search and save matching YouTube `videoId`s to another `.json` (e.g., `youtubeTracks.json`).
- Create and populate YouTube playlists later, using saved files.

### 🧩 Approach 3: One Playlist at a Time (Fine-Grained)

- Choose one playlist from Spotify.
- Search and store its video IDs.
- Then:
- Create a YouTube playlist.
- Add the stored video IDs.

---

## ❓ Why Use Approach 2 or 3?

YouTube API has **daily quota limits**.

By breaking your process into two steps — **searching + saving**, and **creating + adding** — you avoid exceeding quota in a single run.  
This allows you to resume your work later using saved data.

---

## ✅ Notes

- You can edit the folder structure to avoid tampering with the main `spotifyTracks.json` and `youtubeTracks.json` by saving working files in separate folders like `./data/processed/`.
- You can write helper functions like:
- `moveSinglePlaylist()`
- `prepareOnePlaylist()`
- `createYouTubePlaylistFromFile()`

---