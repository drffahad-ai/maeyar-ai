const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const language = req.body.language || "ar";

    let systemPrompt = "";

    if (language === "ar") {
      systemPrompt = "أنت مساعد ذكي تتحدث باللغة العربية فقط وبأسلوب واضح.";
    } else {
      systemPrompt = "You are a helpful AI assistant. Respond in English.";
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

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).send("خطأ في السيرفر");
  }
});

app.get("/", (req, res) => {
  res.send("MAEYAR AI شغال 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
