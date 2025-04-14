const axios = require("axios");
const { FLOWISE_API_URL } = require("../config/flowiseConfig");

const queryFlowise = async (data) => {
  try {
    const response = await axios.post(FLOWISE_API_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    console.error("Flowise API Error:", err.response?.data || err.message);
    throw new Error("Failed to query Flowise API");
  }
};