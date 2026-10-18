/**
 * DioBook Cloudflare Worker (v2)
 * - Free Emotional & Multilingual Neural TTS (Microsoft Edge Read-Aloud v2 + Expressive Prosody)
 * - Deepgram Aura-2 (@cf/deepgram/aura-2-en) & Aura-1 (@cf/deepgram/aura-1) via Cloudflare Workers AI
 * - AI Book Companion (/summarize, /chat, /define, /recommend) & CORS Fetch Proxy (/fetch)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// ============================================================================
// Voice Catalog (33 Free Voices: Turkish, Multilingual Expressive, Aura-2, Aura-1)
// ============================================================================
const VOICES = [
  // --- Turkish & Multilingual Emotional Voices (Edge Neural v2) ---
  { id: 'tr-TR-EmelNeural', name: 'Emel (Türkçe)', lang: 'tr-TR', gender: 'Female', style: 'Duygusal, sıcak ve akıcı hikâye anlatımı', badge: 'Türkçe · Duygusal', category: 'tr' },
  { id: 'tr-TR-AhmetNeural', name: 'Ahmet (Türkçe)', lang: 'tr-TR', gender: 'Male', style: 'Derin, etkileyici ve doğal roman anlatımı', badge: 'Türkçe · Duygusal', category: 'tr' },
  { id: 'en-US-AvaMultilingualNeural', name: 'Ava Multilingual (TR/EN)', lang: 'tr-TR / en-US', gender: 'Female', style: 'Yüksek duygusal tonlama, Türkçe & İngilizce kitaplar', badge: 'Çok Dilli · Duygusal', category: 'tr' },
  { id: 'en-US-AndrewMultilingualNeural', name: 'Andrew Multilingual (TR/EN)', lang: 'tr-TR / en-US', gender: 'Male', style: 'Sıcak, sinematik hikâye anlatıcısı (TR & EN)', badge: 'Çok Dilli · Duygusal', category: 'tr' },
  { id: 'en-US-EmmaMultilingualNeural', name: 'Emma Multilingual (TR/EN)', lang: 'tr-TR / en-US', gender: 'Female', style: 'Yumuşak, empatik ve samimi anlatım (TR & EN)', badge: 'Çok Dilli · Duygusal', category: 'tr' },
  { id: 'en-US-BrianMultilingualNeural', name: 'Brian Multilingual (TR/EN)', lang: 'tr-TR / en-US', gender: 'Male', style: 'Sakin, akıcı ve doğal anlatım (TR & EN)', badge: 'Çok Dilli · Duygusal', category: 'tr' },
  { id: 'fr-FR-VivienneMultilingualNeural', name: 'Vivienne Multilingual (TR/EN/FR)', lang: 'Çok Dilli', gender: 'Female', style: 'Zarif, melodik ve duygusal anlatıcı', badge: 'Çok Dilli · Duygusal', category: 'tr' },
  { id: 'de-DE-SeraphinaMultilingualNeural', name: 'Seraphina Multilingual (TR/EN/DE)', lang: 'Çok Dilli', gender: 'Female', style: 'Berrak, duygusal çok dilli anlatıcı', badge: 'Çok Dilli · Duygusal', category: 'tr' },

  // --- English Expressive Neural Voices (Edge Neural v2) ---
  { id: 'en-US-AriaNeural', name: 'Aria (Expressive)', lang: 'en-US', gender: 'Female', style: 'Expressive, lively & emotional fiction narrator', badge: 'Duygusal', category: 'expressive' },
  { id: 'en-US-GuyNeural', name: 'Guy (Expressive)', lang: 'en-US', gender: 'Male', style: 'Passionate, dramatic & dynamic storyteller', badge: 'Duygusal', category: 'expressive' },
  { id: 'en-US-JennyNeural', name: 'Jenny (Expressive)', lang: 'en-US', gender: 'Female', style: 'Warm, conversational & empathetic voice', badge: 'Duygusal', category: 'expressive' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia (British Expressive)', lang: 'en-GB', gender: 'Female', style: 'Refined, expressive British novel narrator', badge: 'Duygusal', category: 'expressive' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (British Expressive)', lang: 'en-GB', gender: 'Male', style: 'Rich, dramatic British storyteller', badge: 'Duygusal', category: 'expressive' },

  // --- Deepgram Aura-2 Expressive Voices (Workers AI @cf/deepgram/aura-2-en) ---
  { id: 'aura-2-thalia-en', name: 'Thalia (Aura 2)', lang: 'en-US', gender: 'Female', style: 'Warm, expressive next-gen audiobook narrator', badge: 'Aura 2 · Duygusal', category: 'expressive' },
  { id: 'aura-2-aurora-en', name: 'Aurora (Aura 2)', lang: 'en-US', gender: 'Female', style: 'Melodic, emotional & rich storytelling', badge: 'Aura 2 · Duygusal', category: 'expressive' },
  { id: 'aura-2-apollo-en', name: 'Apollo (Aura 2)', lang: 'en-US', gender: 'Male', style: 'Charismatic, resonant & expressive', badge: 'Aura 2 · Duygusal', category: 'expressive' },
  { id: 'aura-2-draco-en', name: 'Draco (Aura 2)', lang: 'en-GB', gender: 'Male', style: 'Dramatic, cinematic British narration', badge: 'Aura 2 · Duygusal', category: 'expressive' },
  { id: 'aura-2-helena-en', name: 'Helena (Aura 2)', lang: 'en-US', gender: 'Female', style: 'Natural, caring & deeply expressive', badge: 'Aura 2 · Duygusal', category: 'expressive' },
  { id: 'aura-2-orpheus-en', name: 'Orpheus (Aura 2)', lang: 'en-US', gender: 'Male', style: 'Deep, emotional & intimate fiction voice', badge: 'Aura 2 · Duygusal', category: 'expressive' },
  { id: 'aura-2-callista-en', name: 'Callista (Aura 2)', lang: 'en-US', gender: 'Female', style: 'Energetic, vivid & engaging narrator', badge: 'Aura 2', category: 'expressive' },
  { id: 'aura-2-minerva-en', name: 'Minerva (Aura 2)', lang: 'en-US', gender: 'Female', style: 'Poised, literary & thoughtful', badge: 'Aura 2', category: 'expressive' },

  // --- Classic Deepgram Aura-1 Voices (Workers AI @cf/deepgram/aura-1) ---
  { id: 'asteria-en', name: 'Asteria', lang: 'en-US', gender: 'Female', style: 'Warm, expressive — great for fiction', category: 'studio' },
  { id: 'luna-en', name: 'Luna', lang: 'en-US', gender: 'Female', style: 'Soft, calm — bedtime reading', category: 'studio' },
  { id: 'stella-en', name: 'Stella', lang: 'en-US', gender: 'Female', style: 'Clear, upbeat — non-fiction', category: 'studio' },
  { id: 'athena-en', name: 'Athena', lang: 'en-GB', gender: 'Female', style: 'British, composed — classics', category: 'studio' },
  { id: 'hera-en', name: 'Hera', lang: 'en-US', gender: 'Female', style: 'Smooth, authoritative', category: 'studio' },
  { id: 'orion-en', name: 'Orion', lang: 'en-US', gender: 'Male', style: 'Deep, narrative — storytelling', category: 'studio' },
  { id: 'arcas-en', name: 'Arcas', lang: 'en-US', gender: 'Male', style: 'Natural, conversational', category: 'studio' },
  { id: 'perseus-en', name: 'Perseus', lang: 'en-US', gender: 'Male', style: 'Confident, energetic', category: 'studio' },
  { id: 'angus-en', name: 'Angus', lang: 'en-IE', gender: 'Male', style: 'Irish, warm — literary', category: 'studio' },
  { id: 'orpheus-en', name: 'Orpheus', lang: 'en-US', gender: 'Male', style: 'Rich, intimate — fiction', category: 'studio' },
  { id: 'helios-en', name: 'Helios', lang: 'en-GB', gender: 'Male', style: 'British, crisp — non-fiction', category: 'studio' },
  { id: 'zeus-en', name: 'Zeus', lang: 'en-US', gender: 'Male', style: 'Deep, commanding — epic', category: 'studio' }
];

// ============================================================================
// Microsoft Edge Neural TTS v2 DRM (Sec-MS-GEC v2 Token Generator)
// ============================================================================
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_FULL_VERSION = '143.0.3650.75';
const SEC_MS_GEC_VERSION = `2-${CHROMIUM_FULL_VERSION}`;
const WIN_EPOCH = 11644473600;

const SHA256_INITIAL = [
  0x6A09E667n, 0xBB67AE85n, 0x3C6EF372n, 0xA54FF53An,
  0x510E527Fn, 0x9B05688Cn, 0x1F83D9ABn, 0x5BE0CD19n,
];
const SHA256_STATE = [
  0xFD9FBEA2n, 0x91243CE7n, 0xBE499094n, 0xCD2E1E0An,
  0x6C006F49n, 0x04BD35ABn, 0xFEB0A7E4n, 0x03EFFBD2n,
];
const SHA256_SCHEDULE = [
  0xEB24BF9En, 0x1558691Fn, 0xA0C09EE2n, 0x0CFA32BAn,
  0xA622EE8Cn, 0xD1DD9491n, 0xC0DD25A0n, 0xF9E70AB6n,
  0xF0C31573n, 0x7058CE4En, 0x7188E606n, 0x00E5AB33n,
  0xD258B060n, 0x72766564n,
];
const SHA256_ROUND_CONSTANTS = [
  0x428A2F98n, 0x71374491n, 0xB5C0FBCFn, 0xE9B5DBA5n, 0x3956C25Bn, 0x59F111F1n, 0x923F82A4n, 0xAB1C5ED5n,
  0xD807AA98n, 0x12835B01n, 0x243185BEn, 0x550C7DC3n, 0x72BE5D74n, 0x80DEB1FEn, 0x9BDC06A7n, 0xC19BF174n,
  0xE49B69C1n, 0xEFBE4786n, 0x0FC19DC6n, 0x240CA1CCn, 0x2DE92C6Fn, 0x4A7484AAn, 0x5CB0A9DCn, 0x76F988DAn,
  0x983E5152n, 0xA831C66Dn, 0xB00327C8n, 0xBF597FC7n, 0xC6E00BF3n, 0xD5A79147n, 0x06CA6351n, 0x14292967n,
  0x27B70A85n, 0x2E1B2138n, 0x4D2C6DFCn, 0x53380D13n, 0x650A7354n, 0x766A0ABBn, 0x81C2C92En, 0x92722C85n,
  0xA2BFE8A1n, 0xA81A664Bn, 0xC24B8B70n, 0xC76C51A3n, 0xD192E819n, 0xD6990624n, 0xF40E3585n, 0x106AA070n,
  0x19A4C116n, 0x1E376C08n, 0x2748774Cn, 0x34B0BCB5n, 0x391C0CB3n, 0x4ED8AA4An, 0x5B9CCA4Fn, 0x682E6FF3n,
  0x748F82EEn, 0x78A5636Fn, 0x84C87814n, 0x8CC70208n, 0x90BEFFFAn, 0xA4506CEBn, 0xBEF9A3F7n, 0xC67178F2n,
];
const SHA256_ADJUSTMENT = 0xC9DC06A7n;
const SHA256_BLOCK_CONSTANTS = SHA256_ROUND_CONSTANTS.map((c, i) => i === 14 ? SHA256_ADJUSTMENT : c);
const SHA256_SIGMA0_ADJUSTMENT = 0x059C0B80n;
const SHA256_SIGMA1_ADJUSTMENT = 0x000B92C0n;

const CS64_COEFFICIENTS = [
  [0xE82E91B1n, 0xB32700D0n],
  [0x44DE24C6n, 0x88DFF51Dn],
  [0x3BEB65BCn, 0x29514038n],
  [0xC89C5933n, 0xB328CBDFn],
  [0x8D1EC211n, 0xD405B4D5n],
  [0x314EF5D5n, 0x26E55F3Cn],
  [0xE92491B1n, 0x607801C6n],
  [0xF0A5B9D5n, 0x82B2C1FBn],
  [0x06064CF3n, 0xFA51A3DAn],
  [0xDA79FA60n, 0x207CC464n],
  [0xBED20560n, 0x3C3C74F3n],
  [0x89F9C9F8n, 0xD2D14B61n],
  [0x35FA38C6n, 0xBB04A2C1n],
  [0xCB49E3C6n, 0xC5626167n],
];
const CS64_FACTOR = 0x82893933n;
const CS64_ADJUSTMENT0 = 0xF2F90B1An;
const CS64_ADJUSTMENT1 = 0x0B1A0000n;
const MASK = 0xFFFFFFFFn;

function rol16(val) {
  const v = val & MASK;
  return ((v << 16n) | (v >> 16n)) & MASK;
}
function sigma0(v) {
  return ((v >> 7n) ^ (v << 25n) ^ (v >> 18n) ^ (v << 14n) ^ (v >> 3n)) & MASK;
}
function sigma1(v) {
  return ((v >> 17n) ^ (v << 15n) ^ (v >> 19n) ^ (v >> 13n) ^ (v >> 10n)) & MASK;
}
function sha256Rounds(state, words, firstRound = 0) {
  let [a, b, c, d, e, f, g, h] = state;
  const constants = firstRound === 14 ? SHA256_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS;
  for (let i = firstRound; i < 64; i++) {
    const s1 = ((e >> 6n) | (e << 26n)) ^ ((e >> 11n) | (e << 21n)) ^ ((e >> 25n) | (e << 7n));
    const ch = (e & f) ^ ((~e & MASK) & g);
    const t1 = (h + (s1 & MASK) + ch + constants[i] + words[i]) & MASK;
    const s0 = ((a >> 2n) | (a << 30n)) ^ ((a >> 13n) | (a << 19n)) ^ ((a >> 22n) | (a << 10n));
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const t2 = ((s0 & MASK) + maj) & MASK;
    h = g; g = f; f = e; e = (d + t1) & MASK;
    d = c; c = b; b = a; a = (t1 + t2) & MASK;
  }
  return [a, b, c, d, e, f, g, h];
}
function expandSchedule(words, firstWord = 16) {
  for (let i = firstWord; i < 64; i++) {
    words.push((sigma1(words[i - 2]) + words[i - 7] + sigma0(words[i - 15]) + words[i - 16]) & MASK);
  }
}
function sha256Init(data7) {
  const words = new Array(14).fill(0n);
  words.push(BigInt((data7[0] << 16) | (data7[1] << 8) | data7[2]));
  words.push(BigInt(((data7[3] << 24) | (data7[4] << 16) | (data7[5] << 8) | data7[6]) >>> 0));
  for (let i = 16; i < 30; i++) {
    let val = SHA256_SCHEDULE[i - 16];
    if (i - 2 >= 14) val += i === 16 ? (sigma1(words[i - 2]) ^ SHA256_SIGMA1_ADJUSTMENT) : sigma1(words[i - 2]);
    if (i - 7 >= 14) val += words[i - 7];
    if (i - 15 >= 14) val += i === 29 ? (sigma0(words[i - 15]) ^ SHA256_SIGMA0_ADJUSTMENT) : sigma0(words[i - 15]);
    words.push(val & MASK);
  }
  words.push((sigma1(words[28]) + words[23] + sigma0(words[15]) + words[14] + SHA256_ADJUSTMENT - SHA256_ROUND_CONSTANTS[14]) & MASK);
  expandSchedule(words, 31);
  const working = sha256Rounds(SHA256_STATE, words, 14);
  return SHA256_INITIAL.map((x, idx) => (x + working[idx]) & MASK);
}
function sha256Digest(data) {
  const length = 57 + data.length;
  const rem = data.subarray(7);
  const padZeroes = ((55 - length) % 64 + 64) % 64;
  const padded = new Uint8Array(rem.length + 1 + padZeroes + 8);
  padded.set(rem, 0);
  padded[rem.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setBigUint64(padded.length - 8, BigInt(length * 8), false);
  let state = sha256Init(data.subarray(0, 7));
  for (let offset = 0; offset < padded.length; offset += 64) {
    const words = [];
    for (let i = 0; i < 16; i++) words.push(BigInt(dv.getUint32(offset + i * 4, false)));
    expandSchedule(words, 16);
    const working = sha256Rounds(state, words, 0);
    state = state.map((x, idx) => (x + working[idx]) & MASK);
  }
  const out = new Uint8Array(32);
  const outDv = new DataView(out.buffer);
  state.forEach((w, i) => outDv.setUint32(i * 4, Number(w), false));
  return out;
}
function wordsLe4Even(data) {
  const padLen = (4 - (data.length % 4)) % 4;
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data, 0);
  if (padded.length === 0) return [];
  const dv = new DataView(padded.buffer);
  const words = [];
  for (let i = 0; i < padded.length; i += 4) words.push(BigInt(dv.getUint32(i, true)));
  if (words.length % 2 === 1) words.push(0n);
  return words;
}
function cs64Digest(data, digest) {
  const dv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
  const keyA = BigInt(dv.getUint32(0, true)) | 1n;
  const keyB = BigInt(dv.getUint32(4, true)) | 1n;
  const factors = [(keyA * CS64_FACTOR) & MASK, (keyB * CS64_FACTOR) & MASK];
  const terms = CS64_COEFFICIENTS.map(([coeff], idx) => (coeff * factors[idx % 2]) & MASK);
  const offsets = CS64_COEFFICIENTS.map(([, off]) => off);
  const prefixed = new Uint8Array(1 + data.length);
  prefixed.set(data, 1);
  const words = wordsLe4Even(prefixed);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let term = word * (i % 2 === 0 ? keyA : keyB);
    let offset = rol16(word) * (i % 2 === 0 ? 0xEF0569FBn : 0xC31713DBn);
    if (i === 0) {
      term += CS64_ADJUSTMENT0 * factors[0];
      offset += CS64_ADJUSTMENT1;
    }
    terms.push(term & MASK);
    offsets.push(offset & MASK);
  }
  let swapAcc = 0n, swapLast = 0n, state = 0n, acc = 0n;
  for (let i = 0; i < terms.length; i += 2) {
    const x = terms[i], y = terms[i + 1];
    let t = rol16((offsets[i] + x) & MASK);
    let q = (t * 0x76F50F34n) & MASK;
    swapAcc += (rol16(q) * 0xC3EFEA97n + q) & MASK;
    t = rol16((offsets[i + 1] + y) & MASK);
    q = (t * 0x1881CE3Cn) & MASK;
    swapLast = (rol16(q) * 0x35BD1EC9n + q) & MASK;
    swapAcc = (swapAcc + swapLast) & MASK;
    state = (state * keyA + x) & MASK;
    state = (rol16(state) * 0xCF98B111n) & MASK;
    state = (rol16(state) * 0x87085B9Fn) & MASK;
    state = (rol16(state) * 0x12CEB96Dn) & MASK;
    state = (rol16(state) * 0x257E1D83n) & MASK;
    acc += state;
    t = (state * keyB + y) & MASK;
    t = (rol16(t) * 0xA27416F5n) & MASK;
    t = (rol16(t) * 0xD38396FFn) & MASK;
    state = (rol16((rol16(t) * 0x7C932B89n) & MASK) * 0xBFA49F69n) & MASK;
    acc = (acc + state) & MASK;
  }
  const w0 = (swapLast ^ state) & MASK;
  const w1 = (swapAcc ^ acc) & MASK;
  const out = new Uint8Array(8);
  const outDv = new DataView(out.buffer);
  outDv.setUint32(0, Number(w0), true);
  outDv.setUint32(4, Number(w1), true);
  return out;
}
function toHexUpper(uint8) {
  return Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
function generateSecMsGecV2() {
  let ticks = Math.floor(Date.now() / 1000) + WIN_EPOCH;
  ticks -= ticks % 300;
  const strToHash = `${ticks}0000000${TRUSTED_CLIENT_TOKEN}`;
  const data = new TextEncoder().encode(strToHash);
  const digest = sha256Digest(data);
  const cs64 = cs64Digest(data, digest);
  return `${toHexUpper(cs64)}-${toHexUpper(digest)}`;
}

function escapeXml(str) {
  return String(str)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Computes natural emotional prosody offsets based on sentence punctuation & dialogue cues
 * so narration feels expressive rather than flat.
 */
function computeEmotionalProsody(text, baseRate = 1, basePitch = 1) {
  let ratePct = Math.round(((baseRate || 1) - 1) * 100);
  let pitchHz = Math.round(((basePitch || 1) - 1) * 20);

  const trimmed = text.trim();
  const hasDialogue = /["“”«»]|^—|^–/.test(trimmed);
  const isExclamation = /!\s*["”’»)]*$/.test(trimmed);
  const isQuestion = /\?\s*["”’»)]*$/.test(trimmed);
  const isContemplative = /(\.\.\.|…)\s*["”’»)]*$/.test(trimmed);

  if (isExclamation) {
    pitchHz += 3;
    ratePct += 3;
  } else if (isQuestion) {
    pitchHz += 2;
  } else if (isContemplative) {
    ratePct -= 5;
    pitchHz -= 1;
  } else if (hasDialogue) {
    pitchHz += 1;
  }

  ratePct = Math.max(-40, Math.min(60, ratePct));
  pitchHz = Math.max(-15, Math.min(15, pitchHz));

  return {
    rateStr: (ratePct >= 0 ? '+' : '') + ratePct + '%',
    pitchStr: (pitchHz >= 0 ? '+' : '') + pitchHz + 'Hz'
  };
}

async function synthesizeEdgeNeuralTTS(text, voice, rate = 1, pitch = 1) {
  const connId = crypto.randomUUID().replace(/-/g, '');
  const reqId = crypto.randomUUID().replace(/-/g, '');
  const secMsGec = generateSecMsGecV2();
  const muidBytes = new Uint8Array(16);
  crypto.getRandomValues(muidBytes);
  const muid = toHexUpper(muidBytes);

  const httpsUrl =
    `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1` +
    `?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
    `&ConnectionId=${connId}` +
    `&Sec-MS-GEC=${secMsGec}` +
    `&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;

  const resp = await fetch(httpsUrl, {
    headers: {
      'Upgrade': 'websocket',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0`,
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': `muid=${muid};`
    }
  });

  const ws = resp.webSocket;
  if (!ws) {
    throw new Error(`Edge TTS handshake failed (HTTP ${resp.status})`);
  }
  ws.accept();

  const { rateStr, pitchStr } = computeEmotionalProsody(text, rate, pitch);
  const xmlLang = voice.startsWith('tr-') ? 'tr-TR' : 'en-US';
  const nowStr = new Date().toUTCString();

  return new Promise((resolve, reject) => {
    const audioChunks = [];
    const timer = setTimeout(() => {
      try { ws.close(); } catch {}
      reject(new Error('Edge TTS timeout'));
    }, 12000);

    ws.addEventListener('message', (event) => {
      if (typeof event.data === 'string') {
        if (event.data.includes('Path:turn.end')) {
          clearTimeout(timer);
          try { ws.close(); } catch {}
          const totalLen = audioChunks.reduce((acc, c) => acc + c.byteLength, 0);
          const merged = new Uint8Array(totalLen);
          let offset = 0;
          for (const chunk of audioChunks) {
            merged.set(chunk, offset);
            offset += chunk.byteLength;
          }
          resolve(merged);
        }
      } else if (event.data instanceof ArrayBuffer || ArrayBuffer.isView(event.data)) {
        const buf = event.data instanceof ArrayBuffer
          ? event.data
          : event.data.buffer.slice(event.data.byteOffset, event.data.byteOffset + event.data.byteLength);
        if (buf.byteLength < 2) return;
        const dv = new DataView(buf);
        const headerLen = dv.getUint16(0, false);
        if (buf.byteLength <= 2 + headerLen) return;
        const headerStr = new TextDecoder().decode(new Uint8Array(buf, 2, headerLen));
        if (headerStr.includes('Path:audio')) {
          audioChunks.push(new Uint8Array(buf, 2 + headerLen));
        }
      }
    });

    ws.addEventListener('error', (e) => {
      clearTimeout(timer);
      reject(new Error(e.message || 'Edge WebSocket error'));
    });

    ws.addEventListener('close', () => {
      clearTimeout(timer);
      if (audioChunks.length > 0) {
        const totalLen = audioChunks.reduce((acc, c) => acc + c.byteLength, 0);
        const merged = new Uint8Array(totalLen);
        let offset = 0;
        for (const chunk of audioChunks) {
          merged.set(chunk, offset);
          offset += chunk.byteLength;
        }
        resolve(merged);
      } else {
        reject(new Error('Edge WebSocket closed before audio'));
      }
    });

    ws.send(
      `X-Timestamp:${nowStr}\r\n` +
      `Content-Type:application/json; charset=utf-8\r\n` +
      `Path:speech.config\r\n\r\n` +
      `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`
    );

    const ssml =
      `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${xmlLang}'>` +
      `<voice name='${voice}'>` +
      `<prosody pitch='${pitchStr}' rate='${rateStr}' volume='+0%'>` +
      `${escapeXml(text)}` +
      `</prosody></voice></speak>`;

    ws.send(
      `X-RequestId:${reqId}\r\n` +
      `Content-Type:application/ssml+xml\r\n` +
      `X-Timestamp:${nowStr}Z\r\n` +
      `Path:ssml\r\n\r\n` +
      ssml
    );
  });
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 1. GET /voices
      if (path === '/voices' && request.method === 'GET') {
        return jsonResponse(VOICES);
      }

      // 2. POST /tts
      if (path === '/tts' && request.method === 'POST') {
        const body = await request.json();
        const text = (body.text || '').trim();
        const voice = body.voice || 'asteria-en';
        const rate = Number(body.rate) || 1;
        const pitch = Number(body.pitch) || 1;

        if (!text) {
          return jsonResponse({ error: 'Missing text' }, 400);
        }

        // Route 2A: Microsoft Edge Neural TTS (all *Neural voices: Turkish, Multilingual, Expressive)
        if (voice.endsWith('Neural')) {
          const mp3Bytes = await synthesizeEdgeNeuralTTS(text, voice, rate, pitch);
          return new Response(mp3Bytes, {
            status: 200,
            headers: {
              ...CORS_HEADERS,
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400'
            }
          });
        }

        // Route 2B: Deepgram Aura-2 (@cf/deepgram/aura-2-en)
        if (voice.startsWith('aura-2-')) {
          const speaker = voice.replace(/^aura-2-/, '').replace(/-en$/, '');
          try {
            const aiResp = await env.AI.run('@cf/deepgram/aura-2-en', {
              text,
              speaker,
              encoding: 'mp3'
            });
            return new Response(aiResp, {
              status: 200,
              headers: { ...CORS_HEADERS, 'Content-Type': 'audio/mpeg' }
            });
          } catch {
            // Fallback to Edge Expressive if Workers AI Aura-2 is unavailable
            const mp3Bytes = await synthesizeEdgeNeuralTTS(text, 'en-US-AvaMultilingualNeural', rate, pitch);
            return new Response(mp3Bytes, {
              status: 200,
              headers: { ...CORS_HEADERS, 'Content-Type': 'audio/mpeg' }
            });
          }
        }

        // Route 2C: Classic Deepgram Aura-1 (@cf/deepgram/aura-1)
        const speaker = voice.replace(/-en$/, '');
        const aiResp = await env.AI.run('@cf/deepgram/aura-1', {
          text,
          speaker
        });
        return new Response(aiResp, {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'audio/mpeg' }
        });
      }

      // 3. POST /summarize
      if (path === '/summarize' && request.method === 'POST') {
        const { text = '', language = 'English' } = await request.json();
        const clipped = text.slice(0, 12000);
        const prompt = `Summarize the following book chapter clearly and engagingly in ${language}. Include key events and character moments in 4-6 bullet points:\n\n${clipped}`;
        const ai = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: `You are a helpful literary assistant. Always respond in ${language}.` },
            { role: 'user', content: prompt }
          ]
        });
        return jsonResponse({ summary: ai.response || '' });
      }

      // 4. POST /chat
      if (path === '/chat' && request.method === 'POST') {
        const { bookTitle = '', author = '', chapterLabel = '', context = '', history = [], message = '', language = 'English' } = await request.json();
        const clipped = context.slice(0, 10000);
        const sys = `You are an insightful reading companion for the book "${bookTitle}"${author ? ` by ${author}` : ''} (current chapter: "${chapterLabel}"). Answer in ${language} based on the book and chapter excerpt below:\n\n${clipped}`;
        const messages = [
          { role: 'system', content: sys },
          ...history.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') })),
          { role: 'user', content: message }
        ];
        const ai = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });
        return jsonResponse({ reply: ai.response || '' });
      }

      // 5. POST /define
      if (path === '/define' && request.method === 'POST') {
        const { word = '', context = '', targetLang = 'Turkish' } = await request.json();
        const prompt = `Word: "${word}"\nContext sentence: "${context}"\nProvide a JSON object with keys: "translation" (in ${targetLang}), "definition" (brief explanation in ${targetLang}), and "example" (a short example sentence). Output ONLY valid JSON.`;
        const ai = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: 'You return only valid JSON with keys translation, definition, example.' },
            { role: 'user', content: prompt }
          ]
        });
        const raw = ai.response || '{}';
        const match = raw.match(/\{[\s\S]*\}/);
        let parsed = { translation: word, definition: raw, example: '' };
        if (match) {
          try { parsed = JSON.parse(match[0]); } catch {}
        }
        return jsonResponse(parsed);
      }

      // 6. POST /recommend
      if (path === '/recommend' && request.method === 'POST') {
        const { title = '', author = '', language = 'English' } = await request.json();
        const prompt = `Recommend 4 books similar to "${title}"${author ? ` by ${author}` : ''}. Respond in ${language} as a JSON array of objects with keys "title", "author", and "why". Output ONLY valid JSON.`;
        const ai = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: 'You return only a valid JSON array of objects with keys title, author, why.' },
            { role: 'user', content: prompt }
          ]
        });
        const raw = ai.response || '[]';
        const match = raw.match(/\[[\s\S]*\]/);
        let recs = [];
        if (match) {
          try { recs = JSON.parse(match[0]); } catch {}
        }
        return jsonResponse({ recommendations: recs });
      }

      // 7. GET /fetch?url=...
      if (path === '/fetch' && request.method === 'GET') {
        const targetUrl = url.searchParams.get('url');
        if (!targetUrl) return jsonResponse({ error: 'Missing url parameter' }, 400);
        const upstream = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/143.0.0.0 Safari/537.36'
          }
        });
        const headers = new Headers(CORS_HEADERS);
        const ct = upstream.headers.get('Content-Type');
        if (ct) headers.set('Content-Type', ct);
        return new Response(upstream.body, { status: upstream.status, headers });
      }

      return jsonResponse({ status: 'ok', service: 'DioBook Worker v2' });
    } catch (err) {
      return jsonResponse({ error: err.message || 'Internal error' }, 500);
    }
  }
};
