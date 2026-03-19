export const DECK_THEMES = [
  { accent: '#e8c96d', accent2: '#5ee8a0', cardBack: '#12201c' },
  { accent: '#7eb8f7', accent2: '#c77ef7', cardBack: '#12182a' },
  { accent: '#f77eb8', accent2: '#f7c97e', cardBack: '#1e1218' },
  { accent: '#7ef7e8', accent2: '#7eb8f7', cardBack: '#121e20' },
  { accent: '#b8f77e', accent2: '#f7e87e', cardBack: '#181e12' },
]

export function getThemeForIndex(index) {
  return DECK_THEMES[index % DECK_THEMES.length]
}
