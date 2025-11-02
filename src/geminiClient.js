/*
  Deprecated helper (placeholder)

  The project now uses `src/openaiClient.js`. This file remains as a
  placeholder so imports don't crash, but it will throw if used.
*/

module.exports = {
  sendPrompt: async () => {
    throw new Error('sendPrompt from ./openaiClient.js should be used instead of this deprecated helper.');
  }
};
