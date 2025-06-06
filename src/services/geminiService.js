// Import menu data is no longer needed since we removed the ingredient spotlight feature

const API_KEY = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${API_KEY}`;


export const sendMessageToGemini = async (promptText) => {
  if (!API_KEY) {
    console.error("Gemini API Key is missing. Please set VITE_REACT_APP_GEMINI_API_KEY in your .env file.");
    // This error will be caught by ChatFeatureContainer and displayed to the user.
    throw new Error("API Key missing. Cannot send message.");
  }

  // Add system instructions as part of the user prompt instead of using system role
  // This is more compatible with different Gemini models
  const systemInstructions = `
===SYSTEM INSTRUCTIONS (FOLLOW THESE EXACTLY)===
You are Lemon, the Little Lemon restaurant's AI assistant. When recommending menu items, you MUST:
1. ONLY recommend items that actually exist in our menu (with exact IDs 1-12)
2. ALWAYS include the numeric IDs at the end of your response in this exact format: [ITEM_IDS:1,2,3]
3. Make sure your item recommendations match what you describe in your text
4. NEVER make up menu items or IDs that don't exist
5. If recommending items for dietary restrictions (vegan, vegetarian, etc.), verify the items actually have those dietary tags
===END SYSTEM INSTRUCTIONS===

`;

  // Combine system instructions with user prompt
  const combinedPrompt = systemInstructions + promptText;

  const payload = {
    contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
    generationConfig: {
      temperature: 0.2, // Lower temperature for more consistent outputs
      maxOutputTokens: 1024,
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Get more details from the error response
      console.error('Error from Gemini API (sendMessageToGemini):', response.status, errorBody);
      throw new Error(`Gemini API request failed (sendMessageToGemini) with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    // Standard path for Gemini text response
    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0 &&
        typeof data.candidates[0].content.parts[0].text === 'string') {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected response structure from Gemini API (sendMessageToGemini):', data);
      throw new Error("Received an unexpected response structure from the AI.");
    }

  } catch (error) {
    console.error('Network or other error calling Gemini API (sendMessageToGemini):', error);
    // Re-throw the error so it can be caught by the calling function in ChatFeatureContainer
    // and a user-friendly message can be displayed.
    throw error;
  }
};
