const axios = require("axios");

async function fetchHtml(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching URL:", error.message);
        return null;
    }
}
module.exports = fetchHtml;
