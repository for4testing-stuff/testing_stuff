/* ==========================================================================
   BOURSE·DAILY — js/ai-bridge.js
   Tier 2: Optional Real LLM Bridge (OpenAI/Anthropic compatible) via sessionStorage
   ========================================================================== */

(function() {
  const AI_CONFIG_KEY = 'bourse_ai_config';

  function getConfig() {
    try {
      const data = sessionStorage.getItem(AI_CONFIG_KEY);
      return data ? JSON.parse(data) : null;
    } catch(e) {
      return null;
    }
  }

  function saveConfig(provider, apiKey, model) {
    try {
      sessionStorage.setItem(AI_CONFIG_KEY, JSON.stringify({ provider, apiKey, model }));
    } catch(e) {}
  }

  function clearConfig() {
    try {
      sessionStorage.removeItem(AI_CONFIG_KEY);
    } catch(e) {}
  }

  async function queryLLM(promptText, includePortfolio = false) {
    const config = getConfig();
    if (!config || !config.apiKey) {
      throw new Error('No API key configured in sessionStorage.');
    }

    let context = '';
    if (includePortfolio) {
      const holdings = BourseData.Store.getHoldings();
      context = `User Portfolio Holdings: ${JSON.stringify(holdings)}. `;
    }

    const systemPrompt = `You are an objective financial intelligence assistant for Bourse Daily, a fictional Indian share-market publication.
    CRITICAL BANNED WORDS: Do NOT use the words "buy", "sell", "guarantee", "will rise", or "will fall". Use neutral analytical terminology only (e.g. "accumulate", "reduce exposure", "projected trajectory").
    ${context}`;

    if (config.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText }
          ],
          temperature: 0.3
        })
      });
      if (!res.ok) throw new Error(`OpenAI API error: ${res.statusText}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } else if (config.provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.model || 'claude-3-haiku-20240307',
          system: systemPrompt,
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 500
        })
      });
      if (!res.ok) throw new Error(`Anthropic API error: ${res.statusText}`);
      const data = await res.json();
      return data.content[0].text;
    } else {
      throw new Error('Unknown AI provider.');
    }
  }

  window.BourseAIBridge = {
    getConfig,
    saveConfig,
    clearConfig,
    queryLLM
  };
})();
