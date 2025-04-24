const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI("AIzaSyCRcVzZ73_a10COwYkmGGxt6caXvaxxyPw");

app.post("/api/projects", async (req, res) => {
  const { projectName, projectDescription } = req.body;

  const prompt = `
Generate a JSON file based on the following project details:

{ "project_name": "${projectName}", "project_description": "${projectDescription}" }

The JSON should contain entities in the following format:

1. Entity
   a. Entity_Name
   b. Entity_Description
   c. Fields (field1, field2, field3)

For each entity, extract relevant fields from the project description, such as users, data points, processes, and features. Ensure the entities align with the core functionalities described.

Generate ONLY the JSON without any markdown formatting, code blocks, or explanations. Do not use backticks, do not use \`\`\`json markers. Return only the pure, valid JSON object.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    
    // Clean the response
    // Remove any markdown formatting
    if (text.includes("```")) {
      // Remove beginning markdown
      text = text.replace(/^```json\s*/g, '');
      text = text.replace(/^```\s*/g, '');
      
      // Remove ending markdown
      text = text.replace(/\s*```$/g, '');
    }
    
    // Trim whitespace
    text = text.trim();
    
    console.log("Raw output from Gemini:", text);
    
    // Validate JSON
    try {
      // This will throw if invalid JSON
      JSON.parse(text);
      res.json({ json: text });
    } catch (parseErr) {
      console.error("Invalid JSON generated:", parseErr);
      
      // Send the original text anyway with an error flag
      // This allows the frontend to display the raw text for debugging
      res.status(200).json({ 
        json: text,
        error: "Generated invalid JSON format. The raw text is still provided."
      });
    }
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to generate JSON." });
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:5000`);
});
