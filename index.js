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

    if (!message) {
      return res.status(400).json({ reply: "No message was sent." });
    }

    let systemPrompt = "";
    let languageInstruction = "";

    if (language === "en") {
      systemPrompt = `
You are a professional AI assistant.
You must ALWAYS reply in English only.
Even if the user writes in Arabic, translate the meaning internally and answer in English only.
Do not use Arabic in the final answer.
Format every answer clearly like this:

**Title**
**Immediate Assessment**
- Point
- Point

**Explanation or Options**
- Point
- Point

**Final Advice**
- Point
- Point
      `;
      languageInstruction = "Answer in English only.";
    } else {
      systemPrompt = `
أنت مساعد ذكي محترف.
يجب أن تكون جميع الردود بالعربية فقط.
حتى لو كتب المستخدم بالإنجليزية، افهم المعنى ثم أجب بالعربية فقط.
لا تستخدم الإنجليزية في الرد النهائي.
نسّق كل إجابة بهذا الشكل:

**عنوان مختصر**
**التقييم الفوري**
- نقطة
- نقطة

**الشرح أو الخيارات**
- نقطة
- نقطة

**النصيحة النهائية**
- نقطة
- نقطة
      `;
      languageInstruction = "أجب بالعربية فقط.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${languageInstruction}\n\nUser message: ${message}` }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        reply: language === "en"
          ? "There was an AI service error. Please check the server settings."
          : "صار خطأ من خدمة الذكاء الاصطناعي. راجع إعدادات السيرفر."
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || (
        language === "en"
          ? "No response was received from the AI."
          : "ما وصل رد من الذكاء الاصطناعي."
      )
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      reply: "تعذر الاتصال بالنظام الآن. حاول مرة ثانية بعد قليل."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
