const axios = require("axios");
const querystring = require("querystring");

async function getAuthToken(username, password) {
    const host = process.env.HOST;

    const credentials = `${username}:${password}`;
    const base64Credentials = Buffer.from(credentials).toString("base64");
    const tokenUrl = `https://${host}/oauth/token`;

    const postData = querystring.stringify({
        grant_type: "password",
        username: username,
        password: password,
    });

    try {
        const response = await axios.post(tokenUrl, postData, {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Error getting auth token:", error);
        throw error;
    }
}

module.exports = { getAuthToken };
