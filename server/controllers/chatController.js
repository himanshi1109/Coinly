const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chat = async (req, res) => {
  try {
    const { prompt, history } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ 
        message: "Hi! I'm Coinly's AI Assistant. To actually talk to me, you'll need to add your GEMINI_API_KEY to the server's `.env` file first! ✨" 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let formattedHistory = [];
    if (history && history.length > 0) {
      formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const fullPrompt = `You are a highly intelligent financial assistant living inside a sleek expense manager app called 'Coinly'. Be friendly, concise, and helpful. Use emojis occasionally. User says: ${prompt}`;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    
    res.status(200).json({ message: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Failed to communicate with AI.", error: error.message });
  }
};
