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
      return res.status(400).json({ reply: "ما تم إرسال أي سؤال." });
    }

    let systemPrompt = "";

    if (language === "ar") {
      systemPrompt = `
أنت مساعد ذكي عربي متخصص في عرض المعلومات بشكل مرتب وواضح.
يجب أن تكون الإجابة بالعربية فقط.
نسّق الإجابة دائمًا بهذا الأسلوب:
**عنوان مختصر**
**التقييم الفوري**
- نقطة
- نقطة

**الخيارات أو التفسير**
- نقطة
- نقطة

**النصيحة النهائية**
- نقطة
- نقطة
      `;
    } else {
      systemPrompt = `
You are a helpful AI assistant.
Always respond in clear English and well-structured sections:
**Short Title**
**Immediate Assessment**
- Point
- Point

**Options or Explanation**
- Point
- Point

**Final Advice**
- Point
- Point
      `;
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

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        reply: "صار خطأ من خدمة الذكاء الاصطناعي. راجع المفتاح أو إعدادات السيرفر."
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || "ما وصل رد من الذكاء الاصطناعي."
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
