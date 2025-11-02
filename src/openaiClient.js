/*
  OpenAI client helper
  - Uses the official `openai` package to call the Responses API
  - Expects OPENAI_API_KEY in the environment
  - Optional OPENAI_MODEL environment variable to override the default model
*/

const OpenAI = require('openai');

/**
 * Create a client instance (will throw if OPENAI_API_KEY is missing)
 */
function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY in environment');
  return new OpenAI({ apiKey: key });
}

/**
 * Send a text prompt to OpenAI and return a plain string reply.
 * @param {string} prompt
 * @param {{maxTokens?:number}} opts
 */
async function sendPrompt(prompt, opts = {}) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  try {
    // Use the Responses API which is broadly compatible with newer OpenAI SDKs.
    const res = await client.responses.create({
      model,
      input: prompt,
      // max_tokens may be ignored by some models/providers; keep optional
      ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {})
    });

    // Attempt to extract text from known response shapes.
    if (res.output && Array.isArray(res.output) && res.output.length > 0) {
      // Many responses include a content array with text segments
      const first = res.output[0];
      if (first && Array.isArray(first.content)) {
        // Join any text pieces
        const pieces = first.content
          .filter(c => typeof c === 'object')
          .map(c => (c.text ? c.text : (c.type === 'output_text' && typeof c === 'string' ? c : '')))
          .filter(Boolean);
        if (pieces.length) return pieces.join('').trim();
      }
    }

    // Some SDKs expose `output_text`
    if (typeof res.output_text === 'string' && res.output_text.trim()) return res.output_text.trim();

    // Fallback: try resp.output[0].text
    if (res.output && res.output[0] && typeof res.output[0].text === 'string') {
      return res.output[0].text.trim();
    }

    // Very last resort: stringify the response
    return JSON.stringify(res);
  } catch (err) {
    const msg = err?.response?.data
      ? `OpenAI API error: ${JSON.stringify(err.response.data)}`
      : `OpenAI request failed: ${err.message || err}`;
    throw new Error(msg);
  }
}

module.exports = { sendPrompt };
