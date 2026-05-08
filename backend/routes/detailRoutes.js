const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/ai/details
// @desc    Get detailed travel info (hotels, food, spots) for any location in Bangladesh
router.post('/details', async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) return res.status(400).json({ message: 'Location is required' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // We request a structured JSON response from Gemini
    const prompt = `You are a real-time travel database expert for Bangladesh. 
For the location "${location}", provide exactly 3 top hotels with current estimated per night BDT prices, 3 must-visit tourist spots, and 3 best local restaurants with their specialty food. 
    
Return the response in a clean JSON format like this:
{
  "hotels": [{"name": "Hotel Name", "price": "2500 BDT", "vibe": "Luxury/Budget"}],
  "spots": [{"name": "Spot Name", "desc": "Short description"}],
  "food": [{"name": "Restaurant Name", "specialty": "Dish Name"}]
}
    
Only return the JSON object, nothing else.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Improved cleaning for AI formatting quirks
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI failed to return valid JSON structure");
    
    const tourData = JSON.parse(jsonMatch[0]);
    res.json(tourData);
  } catch (error) {
    console.error('Gemini Detail API Error:', error);
    res.status(500).json({ message: 'Error fetching AI travel intelligence' });
  }
});

module.exports = router;
