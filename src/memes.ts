export type Meme = {
  type: 'youtube' | 'gif';
  src: string;
  caption?: string;
};

export const memes: Meme[] = [
  { type: 'youtube', src: 'd1YBv2mWll0', caption: 'GO GO GO 💪' },
  { type: 'youtube', src: 'kJQP7kiw5Fk', caption: 'Despacito break 🎶' },
  { type: 'youtube', src: 'ZZ5LpwO-An4', caption: 'HEYYEYAAEYAAAEYAEYAA' },
  { type: 'gif', src: 'https://media.tenor.com/Y9p1U0BqJjkAAAAC/this-is-fine.gif', caption: 'This is fine 🔥' },
  { type: 'gif', src: 'https://media.tenor.com/2roX3uxz_68AAAAC/test-exam.gif', caption: 'Toets-vibes' },
  { type: 'gif', src: 'https://media.tenor.com/UoZ7ZvE0jLgAAAAC/galaxy-brain-mind.gif', caption: 'Big brain time 🧠' },
];
