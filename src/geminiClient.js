/*
  Gemini client helper
  - Uses axios to POST to a configurable GEMINI_API_URL
  - Expects GEMINI_API_TOKEN in the environment
  - The exact request/response shape depends on the Gemini endpoint you use.
    This helper attempts a broadly-compatible format and falls back to a few
    common response fields. If your provider uses another schema, adjust the
    sendPrompt() implementation accordingly.
*/

const axios = require('axios');

const DEFAULT_GEMINI_URL = 'https://api.gemini.example/v1/generate';

/**
 * Send a text prompt to the Gemini API and return a string reply.
 * @param {string} prompt
 * @param {object} [opts]
 * @param {number} [opts.maxTokens]
 */
async function sendPrompt(prompt, opts = {}) {
  const url = process.env.GEMINI_API_URL || DEFAULT_GEMINI_URL;
  const token = process.env.GEMINI_API_TOKEN;

  if (!token) {
    throw new Error('Missing GEMINI_API_TOKEN in environment');
  }

  try {
    // Common shape: POST { input: "..." } with Authorization header.
    // Adjust the body if your Gemini provider expects another format.
    const body = {
      input: prompt,
      // conservative max length by default; provider may ignore or use different key
      max_tokens: opts.maxTokens || 512
    };

    const response = await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    // Try several known shapes to extract text.
    const data = response.data || {};

    // 1) data.output_text (some APIs)
    if (typeof data.output_text === 'string' && data.output_text.trim()) {
      return data.output_text.trim();
    }

    // 2) data.text
    if (typeof data.text === 'string' && data.text.trim()) {
      return data.text.trim();
    }

    // 3) data.output[0].content (array of outputs with content)
    if (Array.isArray(data.output) && data.output.length > 0) {
      const first = data.output[0];
      // nested content or text fields
      if (first && typeof first.content === 'string' && first.content.trim()) {
        return first.content.trim();
      }
      if (first && typeof first.text === 'string' && first.text.trim()) {
        return first.text.trim();
      }
    }

    // 4) fallback: return JSON string of the response's main body
    return JSON.stringify(data);
  } catch (err) {
    // Wrap axios/network/timeout errors with clearer message
    const msg = err.response && err.response.data
      ? `Gemini API error: ${JSON.stringify(err.response.data)}`
      : `Gemini request failed: ${err.message}`;
    throw new Error(msg);
  }
}

module.exports = {
  sendPrompt
};
