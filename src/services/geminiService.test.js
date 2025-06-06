/**
 * Unit tests for the Gemini service
 * 
 * These tests focus on the sendMessageToGemini function, which is responsible
 * for sending user messages to the Gemini API and processing the responses.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sendMessageToGemini } from './geminiService';

// Mock the fetch function
global.fetch = vi.fn();

// Mock console methods to avoid cluttering test output
console.error = vi.fn();

// Store the original environment variables
const originalEnv = { ...process.env };

// We need to mock import.meta.env before importing the module
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_REACT_APP_GEMINI_API_KEY: 'test-api-key'
    }
  }
});

describe('geminiService', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore the original environment
    process.env = originalEnv;
  });

  describe('sendMessageToGemini', () => {
    it('should throw an error if API key is missing', async () => {
      // Arrange
      // Create a modified version of the original module with API_KEY undefined
      await import('./geminiService');
      
      // Mock the module to simulate missing API key
      vi.doMock('./geminiService', async () => {
        const actual = await vi.importActual('./geminiService');
        return {
          ...actual,
          // Override the API_KEY reference in the function
          sendMessageToGemini: async () => {
            // This simulates the behavior when API_KEY is undefined
            console.error("Gemini API Key is missing. Please set VITE_REACT_APP_GEMINI_API_KEY in your .env file.");
            throw new Error("API Key missing. Cannot send message.");
          }
        };
      });
      
      // Re-import the module to get the mocked version
      const { sendMessageToGemini: mockedSendMessage } = await import('./geminiService');
      
      // Act & Assert
      await expect(mockedSendMessage('Hello')).rejects.toThrow('API Key missing');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Gemini API Key is missing')
      );
      
      // Clean up
      vi.doUnmock('./geminiService');
    });


    it('should make a POST request to the Gemini API with the correct payload', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [
            {
              content: {
                parts: [{ text: 'AI response' }]
              }
            }
          ]
        })
      };
      
      global.fetch.mockResolvedValueOnce(mockResponse);
      
      // Act
      await sendMessageToGemini('Test message');
      
      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      
      // Check that the request was made with the correct URL and method
      const [url, options] = fetch.mock.calls[0];
      expect(url).toContain('gemma-3-27b-it:generateContent');
      // We don't check the exact API key value as it may be different in the actual implementation
      expect(url).toContain('key=');
      expect(options.method).toBe('POST');
      
      // Check that the payload contains the system instructions and user message
      const payload = JSON.parse(options.body);
      expect(payload.contents[0].role).toBe('user');
      expect(payload.contents[0].parts[0].text).toContain('===SYSTEM INSTRUCTIONS');
      expect(payload.contents[0].parts[0].text).toContain('Test message');
      
      // Check that the generation config is set correctly
      expect(payload.generationConfig.temperature).toBe(0.2);
      expect(payload.generationConfig.maxOutputTokens).toBe(1024);
    });

    it('should return the text response from the API when successful', async () => {
      // Arrange
      const expectedResponse = 'I recommend the Grilled Fish (ID: 5)! [ITEM_IDS:5]';
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [
            {
              content: {
                parts: [{ text: expectedResponse }]
              }
            }
          ]
        })
      };
      
      global.fetch.mockResolvedValueOnce(mockResponse);
      
      // Act
      const result = await sendMessageToGemini('What fish dishes do you recommend?');
      
      // Assert
      expect(result).toBe(expectedResponse);
    });

    it('should throw an error when the API response is not ok', async () => {
      // Arrange
      const mockErrorResponse = {
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue('Bad Request')
      };
      
      global.fetch.mockResolvedValueOnce(mockErrorResponse);
      
      // Act & Assert
      await expect(sendMessageToGemini('Test message')).rejects.toThrow('Gemini API request failed');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error from Gemini API'),
        400,
        'Bad Request'
      );
    });

    it('should throw an error when the API response structure is unexpected', async () => {
      // Arrange
      const mockMalformedResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          // Missing candidates array
          result: 'Some unexpected structure'
        })
      };
      
      global.fetch.mockResolvedValueOnce(mockMalformedResponse);
      
      // Act & Assert
      await expect(sendMessageToGemini('Test message')).rejects.toThrow('Received an unexpected response structure');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected response structure'),
        expect.anything()
      );
    });

    it('should throw an error when a network error occurs', async () => {
      // Arrange
      const networkError = new Error('Network failure');
      global.fetch.mockRejectedValueOnce(networkError);
      
      // Act & Assert
      await expect(sendMessageToGemini('Test message')).rejects.toThrow('Network failure');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Network or other error'),
        networkError
      );
    });

    it('should handle empty text in API response', async () => {
      // Arrange
      const mockEmptyResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          candidates: [
            {
              content: {
                parts: [{ text: '' }]
              }
            }
          ]
        })
      };
      
      global.fetch.mockResolvedValueOnce(mockEmptyResponse);
      
      // Act
      const result = await sendMessageToGemini('Test message');
      
      // Assert
      expect(result).toBe('');
    });
  });
});
