const axios = require("axios");

async function getCustomQuery(token, queryGUID, filter) {
    const baseURL = process.env.BASE_URL;
    const encodedQueryName = encodeURIComponent(queryGUID);
    const encodedFilter = encodeURIComponent(filter);
    console.log(encodedFilter);
    const url = `${baseURL}/customquery/${encodedQueryName}?filter=${encodedFilter}`;
    console.log(encodedFilter);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error getting custom query:", error);
        throw error;
    }
}

module.exports = { getCustomQuery };
