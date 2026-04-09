const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MAEYAR AI شغال 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const language = req.body.language || "ar";

    let systemPrompt = "";

    if (language === "ar") {
      systemPrompt = "أنت مساعد ذكي تتحدث بالعربية بشكل واضح ومهذب.";
    } else {
      systemPrompt = "You are a helpful AI assistant. Reply clearly in English.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "صار خطأ من OpenAI",
        details: data
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      reply: "خطأ في السيرفر",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
