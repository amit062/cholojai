const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/ai/assistant
router.post('/', async (req, res) => {
  const { destinationName, currentDate, currentMonth } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let prompt = "";

  if (!destinationName) {
    // Discovery Mode: Suggest based on season
    prompt = `You are a professional travel assistant for 'Cholojai', the premier travel portal of Bangladesh. 
    The current date is ${currentDate} and the current month is ${currentMonth}. 
    Based on the season in Bangladesh (Winter, Summer, or Monsoon), suggest the top 3 destinations to visit RIGHT NOW. 
    Explain WHY they are perfect for this month. 
    Keep it professional, encouraging, and informative. Use markdown formatting.`;
  } else {
    // Planner Mode: Motivation + Cheapest Way
    prompt = `You are a motivational travel companion for 'Cholojai'. 
    The user is interested in visiting '${destinationName}'. 
    1. Start with a short, powerful motivational quote to inspire them to take a break from life and explore. 
    2. Provide a 'Budget Traveler Strategy' for '${destinationName}'. Explain the CHEAPEST way to enjoy this trip (transport methods, local food tips, and budget stay hacks).
    Keep the tone professional, inspiring, and helpful. Use markdown formatting.`;
  }

  try {
    const result = await model.generateContent(prompt);
    res.json({ advice: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Assistant is resting. Try again shortly." });
  }
});

module.exports = router;
