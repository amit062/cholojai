const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to fetch weather for major cities
async function getBangladeshWeather() {
  const cities = {
    "Dhaka": { lat: 23.8103, lon: 90.4125 },
    "Chattogram": { lat: 22.3569, lon: 91.7832 },
    "Sylhet": { lat: 24.8949, lon: 91.8687 },
    "Coxs Bazar": { lat: 21.4272, lon: 92.0058 }
  };
  
  let formattedWeather = {};
  for (const [name, coords] of Object.entries(cities)) {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code`);
      const data = await res.json();
      formattedWeather[name] = `${data.current.temperature_2m}°C, Code: ${data.current.weather_code}`;
    } catch (e) {
      formattedWeather[name] = "Unknown";
    }
  }
  return formattedWeather;
}

// @route   POST /api/ai/suggest
// @desc    Suggest a destination based on weather
router.post('/suggest', async (req, res) => {
  try {
    const weatherData = await getBangladeshWeather();
    const currentDate = new Date().toLocaleDateString('en-BD', { weekday:'long', month:'long', day:'numeric' });
    const currentTime = new Date().toLocaleTimeString('en-BD');

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are a Bangladesh travel expert for the website Cholojai.
Based on the current date: ${currentDate}, time: ${currentTime}, and weather: ${JSON.stringify(weatherData)},
recommend the single BEST destination in Bangladesh to visit RIGHT NOW.

Format your response exactly as valid JSON:
{
  "destination": "destination name",
  "division": "division name",
  "reason": "2-3 sentence explanation of why this destination is perfect right now",
  "bestFor": ["activity1", "activity2", "activity3"],
  "weatherNote": "brief note about current weather there",
  "quickTip": "one practical tip for visiting now"
}

Be specific to Bangladesh. Reply ONLY with JSON.`;

    const result = await model.generateContent(prompt);
    const jsonStr = result.response.text().match(/\{[\s\S]*\}/);
    
    if (jsonStr) {
      res.json(JSON.parse(jsonStr[0]));
    } else {
      res.json(JSON.parse(result.response.text()));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate AI suggestion." });
  }
});

// @route   POST /api/ai/itinerary
router.post('/itinerary', async (req, res) => {
  try {
    const { destination, days = 3 } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert Bangladesh travel guide for Cholojai.
Create a ${days}-day travel itinerary for ${destination}, Bangladesh.

Format as exactly JSON ONLY:
{
  "destination": "${destination}",
  "duration": "${days} days",
  "bestSeason": "best time to visit",
  "overview": "2-3 sentence poetic description",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["morning activity", "afternoon activity"],
      "meals": {"breakfast": "...", "lunch": "...", "dinner": "..."}
    }
  ],
  "budgetBreakdown": {
    "budget": "BDT amount/day",
    "premium": "BDT amount/day"
  },
  "culturalTips": ["tip1", "tip2"]
}

All places must be real, verified locations. Reply ONLY with JSON.`;

    const result = await model.generateContent(prompt);
    const jsonStr = result.response.text().match(/\{[\s\S]*\}/);
    
    if (jsonStr) {
      res.json(JSON.parse(jsonStr[0]));
    } else {
      res.json(JSON.parse(result.response.text()));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate AI itinerary." });
  }
});

module.exports = router;
