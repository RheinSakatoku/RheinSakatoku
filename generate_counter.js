import fetch from 'node-fetch';
import fs from 'fs';

async function main() {
  // Запрос к API visitor-badge для получения количества
  const pageId = 'RheinSakatoku.rheinsakatoku.github.io';
  const apiUrl = `https://visitor-badge.laobi.icu/badge?page_id=${pageId}`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  const count = data.value || 0;
  console.log(`Visitor count: ${count}`);

  // SVG-шаблон с пиксельным шрифтом Press Start 2P
  const svg = `
<svg width="240" height="60" xmlns="http://www.w3.org/2000/svg">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    text {
      font-family: 'Press Start 2P', monospace;
      font-size: 28px;
      fill: #00ff00;
      paint-order: stroke;
      stroke: black;
      stroke-width: 1.5px;
    }
  </style>
  <text x="10" y="40">Visitors: ${count}</text>
</svg>
`;

  fs.writeFileSync('count.svg', svg.trim());
  console.log('SVG file saved.');
}

main().catch(console.error);
