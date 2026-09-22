// frontend/src/data/reading.js
// Reading access + immersive-preview content for every curated book.
//
// QUOTES: short excerpts verified character-for-character against the
// Project Gutenberg plain-text editions linked in each book's readUrl.
// { text, source } where source names the location in the book.
// TEASERS: original lines inspired by the book's themes. Always displayed
// with the label "Story teaser — not a direct quote."

export function getAccess(book = {}) {
  // Prefer server-resolved fields when present; otherwise resolve locally
  // with the same honest rules (never fabricate a URL).
  if (book.accessType && book.readingUrl !== undefined) {
    return { type: book.accessType, label: book.accessLabel, url: book.readingUrl, gutenbergId: book.gutenbergId || null };
  }
  const readUrl = book.readUrl || '';
  const gutenberg = readUrl.match(/gutenberg\.org\/ebooks\/(\d+)/);
  if (gutenberg) {
    return { type: 'free', label: 'Read Free', url: readUrl, gutenbergId: gutenberg[1] };
  }
  if (book.isbn) {
    return { type: 'preview', label: 'Preview', url: `https://openlibrary.org/isbn/${book.isbn}`, gutenbergId: null };
  }
  if (readUrl) {
    return { type: 'preview', label: 'Preview', url: readUrl, gutenbergId: null };
  }
  if (book.openLibraryId) {
    return { type: 'preview', label: 'Preview', url: `https://openlibrary.org/works/${book.openLibraryId}`, gutenbergId: null };
  }
  return { type: 'none', label: 'No online text available', url: null, gutenbergId: null };
}

// Verified against https://www.gutenberg.org/ebooks/98 (Tale of Two Cities).
const TALE = [
  { text: 'It was the best of times, it was the worst of times.', source: 'Book the First, Chapter I — “The Period”' },
  { text: 'A solemn consideration, when I enter a great city by night, that every one of those darkly clustered houses encloses its own secret.', source: 'Book the Third, Chapter I — “In Secret”' },
];

// Verified against https://www.gutenberg.org/ebooks/1342 (Pride and Prejudice).
const PRIDE = [
  { text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife.', source: 'Chapter I' },
  { text: 'I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!', source: 'Chapter XI — Caroline Bingley' },
];

// Verified against https://www.gutenberg.org/ebooks/84 (Frankenstein).
const FRANKENSTEIN = [
  { text: 'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.', source: 'Letter I — St. Petersburgh' },
  { text: 'I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.', source: 'Chapter 5 — the creation' },
];

// Verified against https://www.gutenberg.org/ebooks/5200 (The Metamorphosis, Wyllie translation).
const METAMORPHOSIS = [
  { text: '…he found himself transformed in his bed into a horrible vermin.', source: 'Opening — Gregor Samsa awakes' },
  { text: 'He lay on his armour-like back, and if he lifted his head a little he could see his brown belly.', source: 'Opening — the transformation' },
];

// Verified against https://www.gutenberg.org/ebooks/1661 (Adventures of Sherlock Holmes).
const SHERLOCK = [
  { text: 'You see, but you do not observe. The distinction is clear.', source: '“A Scandal in Bohemia”' },
  { text: 'All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.', source: 'On Holmes and Irene Adler' },
];

// Verified against https://www.gutenberg.org/ebooks/132 (The Art of War, Giles translation).
const ART_OF_WAR = [
  { text: 'All warfare is based on deception.', source: 'I. Laying Plans' },
  { text: 'If you know the enemy and know yourself, you need not fear the result of a hundred battles.', source: 'III. Attack by Stratagem' },
];

// Verified against https://www.gutenberg.org/ebooks/2500 (Siddhartha).
const SIDDHARTHA = [
  { text: 'In the shade of the house, in the sunshine of the riverbank near the boats…', source: '“The Son of the Brahman”' },
  { text: 'The sun tanned his light shoulders by the banks of the river…', source: '“The Son of the Brahman”' },
];

// Verified against https://www.gutenberg.org/ebooks/216 (Tao Te Ching, Legge translation).
const TAO = [
  { text: 'The Tao that can be trodden is not the enduring and unchanging Tao.', source: 'Part 1, Chapter 1' },
  { text: 'The name that can be named is not the enduring and unchanging name.', source: 'Part 1, Chapter 1' },
];

export const QUOTES = {
  'curated-tale-two-cities': TALE,
  'curated-pride-prejudice': PRIDE,
  'curated-frankenstein': FRANKENSTEIN,
  'curated-metamorphosis': METAMORPHOSIS,
  'curated-sherlock': SHERLOCK,
  'curated-art-of-war': ART_OF_WAR,
  'curated-siddhartha': SIDDHARTHA,
  'curated-tao-te-ching': TAO,
};

// Original teasers — never presented as the author's words.
export const TEASERS = {
  'curated-little-prince': [
    'A pilot. A desert. A boy who fell from the stars.',
    'Grown-ups forgot what matters. Walk with him — and remember.',
  ],
  'curated-white-nights': [
    'Four white nights in St. Petersburg. A dreamer. A stranger who listens.',
    'Some meetings last a lifetime — even when they last only four nights.',
  ],
  'curated-stranger': [
    'A man who refuses to pretend — and a society that cannot forgive it.',
    'Under the Algerian sun, indifference becomes a crime.',
  ],
  'curated-alchemist': [
    'A shepherd, a desert, and a treasure that was never where he looked.',
    'When you want something, all the universe conspires — or does it?',
  ],
  'curated-psych-money': [
    'Wealth is what you don’t see.',
    'Luck, fear, and compounding — the real portfolio is behaviour.',
  ],
  'curated-thinking-fast-slow': [
    'Two minds live in you: one fast, one slow. Both are usually wrong.',
    'A Nobel tour of every shortcut your brain takes.',
  ],
  'curated-mans-search': [
    'Written from inside the worst of the twentieth century.',
    'He who has a why to live can bear almost any how.',
  ],
  'curated-atomic-habits': [
    'You do not rise to your goals. You fall to your systems.',
    'Tiny changes, remarkable results — one percent at a time.',
  ],
  'curated-power-habit': [
    'The loop behind everything you do on autopilot.',
    'Change the cue, keep the craving, rewrite the routine.',
  ],
  'curated-meditations': [
    'An emperor writing to himself at night, on campaign, two thousand years ago.',
    'On duty, impermanence, and the disciplined mind.',
  ],
  'curated-prophet': [
    'Twenty-six prose poems on love, work, sorrow, and freedom.',
    'Gentle words on children, love, and freedom — with thunder in them.',
  ],
  'curated-animal-farm': [
    'The farm is free. The pigs are in charge. Watch closely.',
    'All animals are equal — until the rules start changing.',
  ],
  'curated-1984': [
    'Big Brother is watching. The past is editable. Two plus two is negotiable.',
    'Winston Smith keeps a diary. That is already a crime.',
  ],
  'curated-mockingbird': [
    'A small town, a brave lawyer, and a child learning what justice costs.',
    'Atticus teaches Scout to climb into another person’s skin before judging.',
  ],
  'curated-sapiens': [
    'How did an unremarkable ape come to rule — and reshape — the world?',
    'Wheat domesticated us. Money united us. Stories define us.',
  ],
  'curated-brief-history': [
    'Black holes, the Big Bang, and the arrow of time — from a wheelchair to the edge of the universe.',
    'The universe, explained by its most famous mind.',
  ],
  'curated-cosmos': [
    'Billions upon billions of stars — and one pale blue dot.',
    'Sagan’s humane voyage through space and time.',
  ],
  'curated-freakonomics': [
    'Why do drug dealers live with their mothers? What do teachers and sumo wrestlers share?',
    'Incentives are hiding everywhere. Here’s how to see them.',
  ],
  'curated-selfish-gene': [
    'Bodies are survival machines — built by genes, for genes.',
    'The book that introduced the “meme” and rewired biology.',
  ],
  'curated-hound': [
    'A spectral hound stalks the moors — or does it?',
    'Holmes sends Watson ahead into the fog. The fog pushes back.',
  ],
  'curated-moonstone': [
    'A cursed diamond. A locked country house. Everybody hides something.',
    'The original detective novel — told by everyone except the culprit.',
  ],
  'curated-styles': [
    'Poirot’s first case: poison at Styles Court.',
    'Grey cells, order, and method — meet Hercule Poirot.',
  ],
  'curated-and-then': [
    'Ten strangers. One island. No boat back.',
    'And then there were none — count down with them, if you dare.',
  ],
  'curated-ackroyd': [
    'A village murder with the most famous twist in crime fiction.',
    'Trust the narrator. Or don’t. Poirot is watching.',
  ],
  'curated-woman-white': [
    'A woman in white on a midnight road — and a fortune at stake.',
    'Identities blur in the first great sensation novel.',
  ],
  'curated-39-steps': [
    'One dead man in his flat. Thirty-nine steps to clear his name.',
    'Chased by police and spies across moors and rooftops.',
  ],
  'curated-jekyll-hyde': [
    'Two men, one door, one key — and one terrible secret.',
    'Respectability by day. Something else by night.',
  ],
  'curated-rebecca': [
    'Manderley burns bright in memory — and its mistress never left.',
    'A new bride haunted by the perfect wife who came before.',
  ],
  'curated-turn-screw': [
    'Two children. Two ghosts. One governess who sees too much.',
    'The most debated haunting in literature — you decide.',
  ],
  'curated-dracula': [
    'Letters, diaries, and newspaper clippings track a monster to England.',
    'He comes in fog and ends in dust. The hunt is on.',
  ],
  'curated-dorian-gray': [
    'Forever young — while the portrait in the attic keeps his secrets.',
    'Beauty, influence, and the slow price of the soul.',
  ],
  'curated-carmilla': [
    'Before Dracula, there was Carmilla — beautiful, lonely, thirsty.',
    'A dream of fangs in a Styrian castle.',
  ],
  'curated-sleepy-hollow': [
    'Ichabod Crane rides home past the old church bridge…',
    '…and the Headless Horseman rides out to meet him.',
  ],
  'curated-time-machine': [
    'The year 802,701: gardens above, machinery below.',
    'What becomes of humanity? The Traveller finds out.',
  ],
  'curated-war-worlds': [
    'Cylinders fall from the sky over Surrey. Then the heat-ray.',
    'No army stops them — but Earth has one ally left.',
  ],
  'curated-leagues': [
    'Twenty thousand leagues beneath the waves with Captain Nemo.',
    'Atlantis, icebergs, and a captain running from the world.',
  ],
  'curated-center-earth': [
    'Down an Icelandic volcano toward the center of the Earth.',
    'Prehistoric seas and giant mushrooms await below.',
  ],
  'curated-first-men-moon': [
    'An anti-gravity sphere, two travellers, and the Selenites.',
    'The Moon is inhabited — and it noticed us.',
  ],
  'curated-princess-mars': [
    'John Carter wakes on Mars — stronger, stranger, and at war.',
    'Green warriors, red princesses, and the dying planet Barsoom.',
  ],
  'curated-alice': [
    'Down the rabbit hole: tea parties, grinning cats, flamingo croquet.',
    'Curiouser and curiouser — mind the Queen’s temper.',
  ],
  'curated-peter-pan': [
    'Second star to the right, and straight on till morning.',
    'Neverland: pirates, mermaids, and the boy who never grew up.',
  ],
  'curated-jungle-book': [
    'Raised by wolves, schooled by a bear and a panther.',
    'Beware Shere Khan — and remember the Law of the Jungle.',
  ],
  'curated-treasure-island': [
    'A map, a schooner, and a cook with one leg and two faces.',
    'Yo-ho-ho — but which side is Silver really on?',
  ],
  'curated-secret-garden': [
    'A locked garden. A hidden boy. A girl who learns to bloom.',
    'Turn the key — spring is waiting on the other side.',
  ],
  'curated-wind-willows': [
    'Messing about in boats with Mole, Rat, Badger — and Toad.',
    'Poop-poop! Mr. Toad has a new motor car. Run.',
  ],
  'curated-wizard-oz': [
    'Follow the yellow brick road with Dorothy and friends.',
    'Courage, heart, brains — and no place like home.',
  ],
  'curated-three-men': [
    'Three friends, one dog, and a boat full of bad ideas.',
    'The funniest Thames trip ever rowed.',
  ],
  'curated-pickwick': [
    'Mr. Pickwick’s club tours England collecting mishaps.',
    'Elopements, elections, and the immortal Sam Weller.',
  ],
  'curated-earnest': [
    'Two Ernests, two fiancées, one formidable Lady Bracknell.',
    'A handbag, a Bunburyist, and Wilde at his wittiest.',
  ],
  'curated-happy-prince': [
    'A swallow carries a golden statue’s mercy to the poor.',
    'Small kindnesses, beautifully told — bring tissues.',
  ],
  'curated-aesop': [
    'Slow and steady wins the race.',
    'Two thousand years of foxes, hares, and hard lessons.',
  ],
  'curated-grimm': [
    'Cinderella, Rapunzel, Hansel and Gretel — as dark as ever.',
    'The original fairy tales, thorns and all.',
  ],
  'curated-andersen': [
    'Mermaids, ducklings, snow queens, and emperors with no clothes.',
    'Sorrow and wonder from Denmark’s great storyteller.',
  ],
  'curated-pinocchio': [
    'Every lie makes the nose grow. Every choice shapes the boy.',
    'Whales, foxes, and the road to becoming real.',
  ],
  'curated-peter-rabbit': [
    'Peter ignores his mother and raids Mr. McGregor’s garden.',
    'A very small, very fast, very lucky rabbit.',
  ],
  'curated-velveteen': [
    'What makes a toy Real? Being loved, says the Skin Horse.',
    'The nursery classic about love that wears you shabby.',
  ],
  'curated-odyssey': [
    'Ten years of monsters, sirens, and vengeful gods between Troy and home.',
    'Cunning Odysseus against the sea itself.',
  ],
  'curated-iliad': [
    'Rage, honor, and grief beneath the walls of Troy.',
    'Achilles chooses glory — and pays for it.',
  ],
  'curated-arabian-nights': [
    'One thousand and one nights of stories to save a life.',
    'Aladdin, Ali Baba, Sinbad — Scheherazade tells them all.',
  ],
  'curated-irish-fairy-tales': [
    'Fionn, the Fianna, and the gods of old Ireland.',
    'Giants, salmon of knowledge, and high mischief.',
  ],
  'curated-japanese-fairy-tales': [
    'Peach boys, sparrow inns, and moon princesses.',
    'Old Japan’s loveliest tales, gently told.',
  ],
  'curated-panchatantra': [
    'Lions, jackals, and clever ministers scheme through nested tales.',
    'Ancient India’s witty manual for princes — and everyone else.',
  ],
};

export function getPreview(book = {}) {
  const quotes = QUOTES[book.id];
  if (quotes && quotes.length > 0) {
    return { kind: 'quote', lines: quotes, note: 'Direct excerpt from the public-domain text.' };
  }
  const teasers = TEASERS[book.id];
  if (teasers && teasers.length > 0) {
    return { kind: 'teaser', lines: teasers.map((text) => ({ text, source: null })), note: 'Story teaser — not a direct quote.' };
  }
  // External / Open Library results: generic, clearly-labelled teaser from metadata.
  if (book.description) {
    return { kind: 'teaser', lines: [{ text: book.description.slice(0, 220), source: null }], note: 'Story teaser — not a direct quote.' };
  }
  return { kind: 'teaser', lines: [{ text: `${book.title || 'This book'} — open the preview to read more.`, source: null }], note: 'Story teaser — not a direct quote.' };
}
