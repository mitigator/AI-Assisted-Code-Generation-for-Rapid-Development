const { queryFlowise } = require("../services/flowiseService");

const generateEntities = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const data = await queryFlowise({ question });
    res.json(data);
  } catch (error) {
    console.error("Error in generateEntities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { generateEntities };