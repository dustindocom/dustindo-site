// The tag vocabulary for VA by DD. Two levels, kept small on purpose so every filter is easy to understand:
//   genre (9, drives the app's genre chips)  →  style (a fixed list under each genre)
//   mood  (8, cuts across genres)
// Raw listener tags from Last.fm are messy ("seen live", "glam metal", "80s hair"), so they are only kept when they map
// onto an entry here. Decade tags such as "80s" are ignored on purpose: a song's decade comes from its release year.

export const GENRES = {
  pop: 'Pop / Indie', rock: 'Rock / Alt', rnb: 'R&B / Soul', hip: 'Hip-Hop', elec: 'Electronic',
  lat: 'Latin', jazz: 'Jazz / Funk / Blues', afro: 'Afrobeats / Reggae', ctry: 'Country / Folk',
};

// id: [label, genre, ...Last.fm tags that mean it (normalized: lowercase, & → and, punctuation → space)]
export const STYLES = {
  'dance-pop': ['Dance pop', 'pop', 'dance pop', 'dance'],
  'synth-pop': ['Synth-pop', 'pop', 'synthpop', 'synth pop', 'electropop'],
  'indie-pop': ['Indie pop', 'pop', 'indie pop', 'bedroom pop', 'dream pop'],
  'teen-pop': ['Teen pop & boy bands', 'pop', 'teen pop', 'boy band', 'boyband', 'boy bands', 'girl group'],
  'singer-songwriter': ['Singer-songwriter', 'pop', 'singer songwriter', 'acoustic'],
  'easy-listening': ['Easy listening', 'pop', 'easy listening', 'adult contemporary', 'crooner', 'crooners', 'traditional pop'],
  'doo-wop': ['Doo-wop', 'pop', 'doo wop', 'doowop'],
  'k-pop': ['K-pop', 'pop', 'k pop', 'kpop'],

  'rock-and-roll': ['Rock & roll', 'rock', 'rock and roll', 'rock n roll', 'rockabilly'],
  'british-invasion': ['British Invasion', 'rock', 'british invasion', 'merseybeat'],
  'classic-rock': ['Classic rock', 'rock', 'classic rock'],
  'psychedelic': ['Psychedelic', 'rock', 'psychedelic', 'psychedelic rock', 'acid rock'],
  'prog-rock': ['Prog rock', 'rock', 'progressive rock', 'prog rock', 'prog', 'art rock'],
  'hard-rock': ['Hard rock', 'rock', 'hard rock'],
  'glam-rock': ['Glam rock', 'rock', 'glam rock', 'glam'],
  'hair-metal': ['Hair metal', 'rock', 'hair metal', 'glam metal', 'sleaze rock', '80s metal'],
  'metal': ['Metal', 'rock', 'metal', 'heavy metal', 'thrash metal', 'nu metal', 'alternative metal', 'metalcore'],
  'soft-rock': ['Soft rock', 'rock', 'soft rock', 'yacht rock'],
  'southern-rock': ['Southern rock', 'rock', 'southern rock'],
  'punk': ['Punk', 'rock', 'punk', 'punk rock', 'pop punk', 'hardcore punk'],
  'new-wave': ['New wave & post-punk', 'rock', 'new wave', 'post punk'],
  'grunge': ['Grunge', 'rock', 'grunge'],
  'alternative': ['Alternative', 'rock', 'alternative', 'alternative rock', 'alt rock'],
  'britpop': ['Britpop', 'rock', 'britpop', 'brit pop'],
  'indie-rock': ['Indie rock', 'rock', 'indie rock', 'indie', 'garage rock', 'post punk revival'],
  'emo': ['Emo', 'rock', 'emo'],

  'soul': ['Soul', 'rnb', 'soul', 'classic soul', 'northern soul', 'southern soul'],
  'motown': ['Motown', 'rnb', 'motown'],
  'gospel': ['Gospel', 'rnb', 'gospel'],
  'quiet-storm': ['Quiet storm & slow jams', 'rnb', 'quiet storm', 'slow jams', 'slow jam'],
  'new-jack-swing': ['New jack swing', 'rnb', 'new jack swing'],
  'contemporary-rnb': ['Contemporary R&B', 'rnb', 'rnb', 'r and b', 'contemporary r and b', '90s rnb'],
  'neo-soul': ['Neo-soul', 'rnb', 'neo soul'],

  'old-school-hip-hop': ['Old school', 'hip', 'old school', 'old school hip hop', 'old school rap'],
  'boom-bap': ['Boom bap & East Coast', 'hip', 'boom bap', 'east coast', 'east coast rap', 'east coast hip hop', 'golden age'],
  'west-coast': ['West Coast & G-funk', 'hip', 'west coast', 'west coast rap', 'west coast hip hop', 'g funk'],
  'gangsta-rap': ['Gangsta rap', 'hip', 'gangsta rap', 'gangsta'],
  'southern-hip-hop': ['Southern hip-hop', 'hip', 'dirty south', 'southern rap', 'southern hip hop', 'crunk'],
  'conscious': ['Conscious & alternative', 'hip', 'conscious hip hop', 'political hip hop', 'alternative hip hop', 'jazz rap', 'abstract hip hop'],
  'pop-rap': ['Pop rap', 'hip', 'pop rap'],
  'trap': ['Trap', 'hip', 'trap', 'trap music'],
  'drill': ['Drill', 'hip', 'drill', 'uk drill', 'chicago drill'],
  'uk-rap': ['UK rap & grime', 'hip', 'grime', 'uk hip hop', 'uk rap'],

  'disco': ['Disco', 'elec', 'disco', 'nu disco'],
  'house': ['House', 'elec', 'house', 'deep house', 'tech house', 'chicago house'],
  'techno': ['Techno', 'elec', 'techno'],
  'trance': ['Trance', 'elec', 'trance'],
  'drum-and-bass': ['Drum & bass', 'elec', 'drum and bass', 'dnb', 'jungle'],
  'uk-garage': ['UK garage', 'elec', 'uk garage', '2 step'],
  'dubstep': ['Dubstep', 'elec', 'dubstep'],
  'edm': ['EDM', 'elec', 'edm', 'electro house', 'big room', 'progressive house'],
  'downtempo': ['Downtempo & trip-hop', 'elec', 'downtempo', 'trip hop', 'ambient', 'lounge'],
  'synthwave': ['Synthwave', 'elec', 'synthwave', 'retrowave'],

  'salsa': ['Salsa', 'lat', 'salsa'],
  'bossa-nova': ['Bossa nova & MPB', 'lat', 'bossa nova', 'mpb'],
  'latin-pop': ['Latin pop', 'lat', 'latin pop'],
  'reggaeton': ['Reggaeton', 'lat', 'reggaeton'],
  'latin-trap': ['Latin trap', 'lat', 'latin trap'],
  'bachata': ['Bachata', 'lat', 'bachata'],
  'merengue': ['Merengue', 'lat', 'merengue'],
  'cumbia': ['Cumbia', 'lat', 'cumbia'],
  'regional-mexican': ['Regional Mexican', 'lat', 'regional mexican', 'corridos', 'corridos tumbados', 'banda', 'mariachi', 'norteno', 'ranchera'],

  'blues': ['Blues', 'jazz', 'blues', 'chicago blues', 'delta blues', 'blues rock'],
  'swing': ['Swing & big band', 'jazz', 'swing', 'big band'],
  'bebop': ['Bebop', 'jazz', 'bebop', 'hard bop', 'bop'],
  'cool-jazz': ['Cool jazz', 'jazz', 'cool jazz'],
  'vocal-jazz': ['Vocal jazz', 'jazz', 'vocal jazz', 'jazz vocal'],
  'fusion': ['Fusion', 'jazz', 'jazz fusion', 'fusion', 'jazz funk'],
  'smooth-jazz': ['Smooth jazz', 'jazz', 'smooth jazz'],
  'latin-jazz': ['Latin jazz', 'jazz', 'latin jazz'],
  'funk': ['Funk', 'jazz', 'funk', 'p funk'],

  'ska': ['Ska & rocksteady', 'afro', 'ska', 'rocksteady'],
  'reggae': ['Reggae', 'afro', 'reggae', 'roots reggae'],
  'dub': ['Dub', 'afro', 'dub'],
  'dancehall': ['Dancehall', 'afro', 'dancehall', 'ragga'],
  'afrobeat': ['Afrobeat (classic)', 'afro', 'afrobeat'],
  'highlife': ['Highlife', 'afro', 'highlife'],
  'soca': ['Soca & calypso', 'afro', 'soca', 'calypso'],
  'afrobeats': ['Afrobeats', 'afro', 'afrobeats', 'afropop', 'afro pop', 'naija'],
  'amapiano': ['Amapiano', 'afro', 'amapiano'],

  'classic-country': ['Classic country', 'ctry', 'classic country', 'honky tonk', 'country classics'],
  'outlaw-country': ['Outlaw country', 'ctry', 'outlaw country'],
  'bluegrass': ['Bluegrass', 'ctry', 'bluegrass'],
  'folk': ['Folk', 'ctry', 'folk', 'contemporary folk', 'indie folk', 'folk pop'],
  'folk-rock': ['Folk rock', 'ctry', 'folk rock'],
  'americana': ['Americana', 'ctry', 'americana', 'alt country', 'alternative country'],
  'country-pop': ['Country pop', 'ctry', 'country pop', 'modern country', 'pop country', 'bro country'],
  'texas-country': ['Texas & red dirt', 'ctry', 'red dirt', 'texas country'],
};

export const MOODS = {
  'chill': ['Chill', 'chill', 'chillout', 'chill out', 'relax', 'relaxing', 'mellow', 'calm', 'laid back', 'lazy', 'study'],
  'party': ['Party', 'party', 'club', 'party music', 'banger', 'bangers', 'hype'],
  'feel-good': ['Feel-good', 'happy', 'feel good', 'feelgood', 'uplifting', 'fun', 'good vibes', 'sunshine', 'cheerful', 'positive'],
  'love': ['Love songs', 'love', 'love songs', 'love song', 'romantic', 'romance', 'wedding', 'first dance'],
  'heartbreak': ['Heartbreak', 'sad', 'breakup', 'break up', 'heartbreak', 'melancholy', 'melancholic', 'depressing', 'sad songs'],
  'workout': ['Workout', 'workout', 'gym', 'running', 'energetic', 'motivation', 'pump up'],
  'summer': ['Summer & road trips', 'summer', 'beach', 'summertime', 'road trip', 'driving'],
  'holiday': ['Holiday', 'christmas', 'xmas', 'christmas music', 'christmas songs', 'holiday', 'holidays'],
};

export const normTag = (t = '') => t.toLowerCase().replace(/&/g, ' and ').replace(/[-_/.'’]/g, ' ').replace(/\s+/g, ' ').trim();
const index = (table) => {
  const m = new Map();
  for (const [id, [, ...rest]] of Object.entries(table)) for (const t of rest) if (!m.has(t)) m.set(t, id);
  return m;
};
const STYLE_TAG = index(Object.fromEntries(Object.entries(STYLES).map(([id, [l, , ...tags]]) => [id, [l, ...tags]])));
const MOOD_TAG = index(MOODS);

// Raw tags in order of weight → the style and mood ids they map onto.
export function mapTags(tags, maxStyles = 3, maxMoods = 3) {
  const st = [], md = [];
  for (const raw of tags) {
    const t = normTag(raw);
    const s = STYLE_TAG.get(t), m = MOOD_TAG.get(t);
    if (s && !st.includes(s) && st.length < maxStyles) st.push(s);
    if (m && !md.includes(m) && md.length < maxMoods) md.push(m);
  }
  return { st, md };
}

// What the app needs to label chips: {genres, styles: {id: [label, genre]}, moods: {id: label}}
export const appVocab = () => ({
  genres: GENRES,
  styles: Object.fromEntries(Object.entries(STYLES).map(([id, [label, g]]) => [id, [label, g]])),
  moods: Object.fromEntries(Object.entries(MOODS).map(([id, [label]]) => [id, label])),
});
