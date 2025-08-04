require('dotenv').config();
const axios = require('axios');

const access_token = process.env.GOOGLE_ACCESS_TOKEN;
async function getValue(){
    const url = 'https://www.googleapis.com/youtube/v3/search';
    const response = await axios.get(url,{
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        params: {
            "part": "snippet",
            "maxResults": 2 ,
            "order": "relevance",
            "q" : "saiyaara",
            "safeSearch": "none"
        }
    })
    console.log(response.data.items);
}

getValue();