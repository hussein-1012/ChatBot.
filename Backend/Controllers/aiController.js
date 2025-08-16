const { AzureKeyCredential } = require("@azure/core-auth");
const createClient = require("@azure-rest/ai-inference").default;

const endpoint = "https://models.github.ai/inference";
const token = process.env.AI_TOKEN;
const client = createClient(endpoint, new AzureKeyCredential(token));

async function getAIResponse(userMessage) {
  try {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ];

    const result = await client.path("/chat/completions").post({
      body: {
        model: "gpt-4o-mini",
        messages,
      },
    });

    if (result.status !== "200") {
      console.error("AI API Error:", result);
      return "Error: AI service failed.";
    }

    return result.body.choices[0].message.content;
  } catch (error) {
    console.error("AI Request Error:", error);
    return "Error: Unable to connect to AI service.";
  }
}

module.exports = { getAIResponse };
