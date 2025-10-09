import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sendMessageToGroq } from './groqService';

const ORIGINAL_IMPORT_META = globalThis.import?.meta;
const ORIGINAL_CONSOLE_ERROR = console.error;
const ORIGINAL_FETCH = global.fetch;

const setApiKey = (value) => {
  globalThis.import = {
    meta: {
      env: {
        VITE_GROQ_API_KEY: value
      }
    }
  };
};

describe('groqService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    console.error = vi.fn();
    setApiKey('test-api-key');
  });

  afterEach(() => {
    if (ORIGINAL_FETCH) {
      global.fetch = ORIGINAL_FETCH;
    }
    console.error = ORIGINAL_CONSOLE_ERROR;
    if (ORIGINAL_IMPORT_META) {
      globalThis.import = ORIGINAL_IMPORT_META;
    }
    vi.restoreAllMocks();
  });

  it('throws when API key is missing', async () => {
    setApiKey('');

    await expect(sendMessageToGroq('Hello')).rejects.toThrow('API Key missing');
    expect(console.error).toHaveBeenCalledWith(
      'Groq API Key is missing. Please set VITE_GROQ_API_KEY in your .env file.'
    );
  });

  it('posts the expected payload to Groq', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'AI response [ITEM_IDS:1]'
            }
          }
        ]
      })
    };

    global.fetch.mockResolvedValueOnce(mockResponse);

    await sendMessageToGroq('Test message');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer test-api-key');

    const payload = JSON.parse(options.body);
    expect(payload.model).toBe('llama-3.1-8b-instant');
    expect(payload.temperature).toBeCloseTo(0.2);
    expect(payload.max_tokens).toBe(1024);
    expect(payload.messages[0]).toMatchObject({ role: 'system' });
    expect(payload.messages[1]).toMatchObject({ role: 'user', content: 'Test message' });
    expect(payload.messages[0].content).toContain('Little Lemon');
  });

  it('returns trimmed text from Groq', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: '  Recommendation [ITEM_IDS:1]  '
            }
          }
        ]
      })
    };

    global.fetch.mockResolvedValueOnce(mockResponse);

    const result = await sendMessageToGroq('Recs?');

    expect(result).toBe('Recommendation [ITEM_IDS:1]');
  });

  it('throws when http response is not ok', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 401,
      text: vi.fn().mockResolvedValue('Unauthorized')
    };

    global.fetch.mockResolvedValueOnce(mockErrorResponse);

    await expect(sendMessageToGroq('Test message')).rejects.toThrow('Groq API request failed');
    expect(console.error).toHaveBeenCalledWith(
      'Error from Groq API (sendMessageToGroq):',
      401,
      'Unauthorized'
    );
  });

  it('throws when Groq response contains an error object', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        error: {
          message: 'Rate limit'
        }
      })
    };

    global.fetch.mockResolvedValueOnce(mockResponse);

    await expect(sendMessageToGroq('Test message')).rejects.toThrow('Groq API error: Rate limit');
    expect(console.error).toHaveBeenCalledWith(
      'Error from Groq API payload (sendMessageToGroq):',
      'Rate limit'
    );
  });

  it('throws when message content missing', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {}
          }
        ]
      })
    };

    global.fetch.mockResolvedValueOnce(mockResponse);

    await expect(sendMessageToGroq('Test message')).rejects.toThrow('Received an unexpected response structure');
    expect(console.error).toHaveBeenCalledWith(
      'Unexpected response structure from Groq API (sendMessageToGroq):',
      expect.anything()
    );
  });

  it('propagates fetch/network errors', async () => {
    const networkError = new Error('Network failure');
    global.fetch.mockRejectedValueOnce(networkError);

    await expect(sendMessageToGroq('Test message')).rejects.toThrow('Network failure');
    expect(console.error).toHaveBeenCalledWith(
      'Network or other error calling Groq API (sendMessageToGroq):',
      networkError
    );
  });
});
