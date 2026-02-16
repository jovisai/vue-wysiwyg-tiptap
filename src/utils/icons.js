import { h } from 'vue'

/**
 * Lightweight inline SVG icon components.
 * Replaces @heroicons/vue dependency with zero-dependency functional components.
 * All icons use a 24x24 viewBox with stroke-based rendering (Heroicons Outline style).
 */

const icon = (paths) => (_, { attrs }) =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      'stroke-width': '1.5',
      stroke: 'currentColor',
      ...attrs,
    },
    paths.map((d) => h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d })),
  )

// --- Bubble menu icons ---

export const BoldIcon = icon([
  'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
  'M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
])

export const ItalicIcon = icon(['M10 4h4', 'M14 4l-4 16', 'M6 20h4'])

export const UnderlineIcon = icon([
  'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3',
  'M4 21h16',
])

export const StrikethroughIcon = icon([
  'M16 4c-.5-1.5-2.2-2-4-2-2.2 0-4 1-4 3 0 1.5 1 2.5 4 3',
  'M4 12h16',
  'M8 20c.5 1.5 2.2 2 4 2 2.2 0 4-1 4-3 0-1.5-1-2.5-4-3',
])

export const CodeBracketIcon = icon([
  'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
])

export const LinkIcon = icon([
  'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
])

export const LinkSlashIcon = icon([
  'M13.181 8.68a4.503 4.503 0 0 1 1.903 1.415M10.819 15.32a4.503 4.503 0 0 1-1.903-1.415',
  'm5.636 18.364 1.757-1.757M18.364 5.636l-1.757 1.757',
  'M3 3l18 18',
])

export const PaintBrushIcon = icon([
  'M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42',
])

// --- Slash command icons ---

export const H1Icon = icon(['M4 6v12', 'M4 12h8', 'M12 6v12', 'M17 12l3-2v8'])

export const H2Icon = icon([
  'M4 6v12',
  'M4 12h8',
  'M12 6v12',
  'M17 12a3 3 0 1 1 0 4h4',
])

export const H3Icon = icon([
  'M4 6v12',
  'M4 12h8',
  'M12 6v12',
  'M17.5 10.5a2 2 0 0 1 2 2c0 1-1 2-2 2m0 0a2 2 0 0 1 2 2c0 1-1 2-2 2',
])

export const ListBulletIcon = icon([
  'M8.25 6.75h12M8.25 12h12M8.25 17.25h12',
  'M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z',
])

export const NumberedListIcon = icon([
  'M8.25 6.75h12M8.25 12h12M8.25 17.25h12',
  'M3.75 5.25v2.25h1.5',
  'M3.75 11.25 5 10.5a.75.75 0 0 1 .75.75v1.5h-2',
  'M3.75 15.75h1.5a.75.75 0 0 1 0 1.5h-1.5m0 0h1.5a.75.75 0 0 1 0 1.5h-1.5',
])

export const CheckIcon = icon(['M4.5 12.75l6 6 9-13.5'])

export const ChatBubbleIcon = icon([
  'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.2 48.2 0 0 0 5.887-.47c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z',
])

export const MinusIcon = icon(['M5 12h14'])

export const PhotoIcon = icon([
  'm2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Zm11.25-13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z',
])
