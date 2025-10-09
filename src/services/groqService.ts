const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatCompletionRequest {
  model: string;
  messages: GroqChatMessage[];
  temperature: number;
  max_tokens: number;
  stream?: boolean;
}

interface GroqChoice {
  message?: {
    role?: string;
    content?: string;
  };
}

interface GroqError {
  message?: string;
}

interface GroqChatCompletionResponse {
  choices?: GroqChoice[];
  error?: GroqError;
}

const SYSTEM_INSTRUCTIONS = `You are Lemon, the Little Lemon restaurant's AI assistant. When recommending menu items, you MUST:
1. ONLY recommend items that actually exist in our menu (with exact IDs 1-12)
2. ALWAYS include the numeric IDs at the end of your response in this exact format: [ITEM_IDS:1,2,3]
3. Make sure your item recommendations match what you describe in your text
4. NEVER make up menu items or IDs that don't exist
5. If recommending items for dietary restrictions (vegan, vegetarian, etc.), verify the items actually have those dietary tags`;

const getGroqApiKey = () => import.meta.env?.VITE_GROQ_API_KEY ?? '';

export const sendMessageToGroq = async (promptText: string): Promise<string> => {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    console.error('Groq API Key is missing. Please set VITE_GROQ_API_KEY in your .env file.');
    throw new Error('API Key missing. Cannot send message.');
  }

  const payload: GroqChatCompletionRequest = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTIONS },
      { role: 'user', content: promptText }
    ],
    temperature: 0.2,
    max_tokens: 1024,
    stream: false
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error from Groq API (sendMessageToGroq):', response.status, errorBody);
      throw new Error(`Groq API request failed (sendMessageToGroq) with status ${response.status}: ${errorBody}`);
    }

    const data = (await response.json()) as GroqChatCompletionResponse;

    if (data.error) {
      console.error('Error from Groq API payload (sendMessageToGroq):', data.error.message);
      throw new Error(`Groq API error: ${data.error.message ?? 'Unknown error'}`);
    }

    const content = data.choices?.[0]?.message?.content;

    if (typeof content === 'string') {
      return content.trim();
    }

    console.error('Unexpected response structure from Groq API (sendMessageToGroq):', data);
    throw new Error('Received an unexpected response structure from the AI.');
  } catch (error) {
    console.error('Network or other error calling Groq API (sendMessageToGroq):', error);
    throw error;
  }
};
