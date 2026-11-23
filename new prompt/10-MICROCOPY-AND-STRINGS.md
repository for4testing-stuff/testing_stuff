# 10 · Microcopy and strings (English + हिन्दी)

Voice: plain, calm, newspaper-neutral. Short sentences. Say what happened and what to do next. Never blame the user. No exclamation marks, no emoji, no jargon without a tooltip. Numbers are Indian-grouped. Every string lives in `js/core/i18n.js` as `key: {en, hi}` and is read through `t('key', {vars})`. Missing hi → fall back to en and log once in dev.

## 1. Global
| key | en | hi |
|---|---|---|
| skip | Skip to main content | मुख्य सामग्री पर जाएँ |
| nav.markets | Markets | बाज़ार |
| nav.screener | Screener | स्क्रीनर |
| nav.watchlist | Watchlist | वॉचलिस्ट |
| nav.portfolio | Portfolio | पोर्टफ़ोलियो |
| nav.tools | Tools | उपकरण |
| nav.learn | Learn | सीखें |
| search.placeholder | Search companies, symbols, sectors (press /) | कंपनी, सिंबल या सेक्टर खोजें (/ दबाएँ) |
| search.none | No match for “{q}”. Try a symbol such as MRDN. | “{q}” के लिए कोई परिणाम नहीं। MRDN जैसा सिंबल आज़माएँ। |
| status.open | Market open · closes 3:30 pm IST | बाज़ार खुला · दोपहर 3:30 बजे बंद |
| status.closed | Market closed · opens {when} | बाज़ार बंद · {when} को खुलेगा |
| live | LIVE | लाइव |
| pause | Pause live updates | लाइव अपडेट रोकें |
| resume | Resume live updates | लाइव अपडेट चालू करें |
| sample | Sample data. Fictional companies. Not financial advice. | नमूना डेटा। काल्पनिक कंपनियाँ। वित्तीय सलाह नहीं। |
| updated | Last updated {time} IST | अंतिम अपडेट {time} IST |
| offline | You’re offline. Showing saved sample data. | आप ऑफ़लाइन हैं। सहेजा गया नमूना डेटा दिख रहा है। |
| nm | NM | लागू नहीं |
| nm.tip | Not meaningful: the company is loss-making, so P/E can’t be used. | लागू नहीं: कंपनी घाटे में है, इसलिए P/E उपयोगी नहीं। |

## 2. Buttons and actions
Buy · Sell · Trade · Add to watchlist · In watchlist ✓ (use text “In watchlist”) · Remove · Set alert · Compare · Share · Print · Copy · Copied · Export CSV · Export JSON · Import · Save screen · Clear filters · Reset · Undo · Retry · Close · Cancel · Confirm · Place order · Review order · Back · Next · Skip · Done · Load more · Show data table · Hide data table · Ask the Analyst · Listen · Stop.
hi: खरीदें · बेचें · ट्रेड · वॉचलिस्ट में जोड़ें · वॉचलिस्ट में है · हटाएँ · अलर्ट सेट करें · तुलना करें · साझा करें · प्रिंट · कॉपी · कॉपी हो गया · CSV निर्यात · JSON निर्यात · आयात · स्क्रीन सहेजें · फ़िल्टर हटाएँ · रीसेट · पूर्ववत · दोबारा कोशिश करें · बंद करें · रद्द करें · पुष्टि करें · ऑर्डर दें · ऑर्डर देखें · वापस · आगे · छोड़ें · पूरा · और दिखाएँ · डेटा तालिका दिखाएँ · डेटा तालिका छिपाएँ · विश्लेषक से पूछें · सुनें · रोकें.

## 3. Empty states
| key | en | hi |
|---|---|---|
| empty.watchlist.title | Your watchlist is empty | आपकी वॉचलिस्ट खाली है |
| empty.watchlist.body | Star a company to follow it here. | किसी कंपनी पर तारा लगाएँ, वह यहाँ दिखेगी। |
| empty.holdings.title | No holdings yet | अभी कोई होल्डिंग नहीं |
| empty.holdings.body | Place a sample order to see your portfolio. | पोर्टफ़ोलियो देखने के लिए नमूना ऑर्डर दें। |
| empty.orders | No open orders. | कोई खुला ऑर्डर नहीं। |
| empty.screener | No companies match. Try removing a filter. | कोई कंपनी मेल नहीं खाती। कोई फ़िल्टर हटाकर देखें। |
| empty.search | Nothing found. Check the spelling or try a sector. | कुछ नहीं मिला। वर्तनी जाँचें या सेक्टर आज़माएँ। |
| empty.alerts | No alerts. Set one from any stock page. | कोई अलर्ट नहीं। किसी स्टॉक पेज से सेट करें। |
| notfound.stock | We couldn’t find that company. | वह कंपनी नहीं मिली। |
| notfound.page | Erratum: this page doesn’t exist. | भूल-सुधार: यह पृष्ठ मौजूद नहीं है। |

## 4. Errors and validation
| key | en |
|---|---|
| err.load | Couldn’t load sample data. Check your connection and retry. |
| err.storage | Your browser isn’t saving changes in this mode. Export your data to keep it. |
| err.quota | Storage is full. Export your data, then clear old items. |
| err.qty.min | Enter a quantity of 1 or more. |
| err.qty.max | You hold {n} shares. Enter {n} or fewer. |
| err.cash | Not enough cash. You need ₹ {need} and have ₹ {have}. |
| err.price.band | Price must be within ±20% of the previous close (₹ {lo} to ₹ {hi}). |
| err.number | Enter numbers only. |
| err.required | This field is required. |
| err.import | That file couldn’t be read. Use a file exported from this site. |
| err.alert.dup | You already have this alert. |
Rule: error = what is wrong + how to fix, in ≤ 18 words.

## 5. Toasts and confirmations
Added {symbol} to {list}. · Removed {symbol}. Undo · Order placed (sample): {side} {qty} {symbol} at ₹ {price} · Order cancelled. · Alert set: {symbol} {cond} ₹ {value} · Alert hit: {symbol} crossed ₹ {value} · Copied to clipboard · Settings saved · Data exported · Account reset.
Destructive confirmations: title states the action and count (“Remove 3 companies?”), body states consequence (“This can be undone for 10 seconds.”), buttons “Remove 3” / “Keep”. Reset account requires typing RESET.

## 6. Tooltips (≤ 140 chars)
P/E: How many rupees investors pay for ₹ 1 of yearly profit. · Market cap: Share price × number of shares. Shown in crore (₹ Cr). · 52-week range: Lowest and highest price in the last year. · EPS: Profit per share over the last year. · Dividend yield: Yearly dividend as a % of the price. · Beta: How strongly the stock moves compared with the market. · Volume: Number of shares traded today. · Avg price: Average rupees you paid per share. · XIRR: Yearly return that accounts for when you added money. · Limit order: Runs only at your price or better. · Stop-loss: Sells automatically if the price falls to your stop price. · Brokerage: Fee charged by the broker for each order (sample 0.03%). · LTP: Last traded price. · Breadth: How many stocks rose versus fell.

## 7. AI and disclaimers
- AI label: “Sample data · AI-generated · Not financial advice”
- Refusal: “I can’t recommend trades. Here is how {name} looks on the numbers:”
- Unknown: “I can answer questions like:” + chips (“Which stocks are near their 52-week high?”, “Compare MRDN and CYBR”, “What is P/E?”, “Loss-making companies”, “My biggest holding”, “SIP of ₹ 5,000 for 10 years at 12%”)
- Thinking: “Analyst is thinking”
- Cloud notice: “Cloud AI is on. Only your question and the numbers you see on screen are sent.”

## 8. Aria and live-region strings
“Sorted by {column}, {ascending/descending}.” · “Showing {a} to {b} of {n} companies.” · “{symbol} added to watchlist.” · “Dialog: Trade {symbol}.” · “Chart: {symbol} price, {range}. Starts at ₹ {a}, ends at ₹ {b}, {up/down} {pct} percent. Press Tab to explore data.” · “{n} results available. Use up and down arrows.” · “Alert triggered: {symbol} crossed ₹ {value}.” · “Order placed.”

## 9. Date, time, number formats
`en-IN` dates “22 Nov 2026”, times 24-hour in tables (“15:30”) and 12-hour in sentences (“3:30 pm IST”). Currency “₹ 1,23,456.00” (space after ₹). Compact: “₹ 4.5 L”, “₹ 12.3 Cr”. Percent: “+1.03%”. Negative uses true minus “−”. Hindi mode keeps Latin digits by default; offer Devanagari digits in Settings (off by default).

## 10. Content guidelines
Headlines ≤ 12 words, kicker in caps ≤ 4 words, ledes ≤ 25 words, buttons 1–3 words, labels never end with a colon, sentence case everywhere except kickers and column headers.
