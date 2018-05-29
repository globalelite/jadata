const client = require('cheerio-httpcli');

const log = (str) => console.error(`-- ${str}`);

log('Fetch jp_prefs');

client.fetch('https://ja.wikipedia.org/wiki/%E9%83%BD%E9%81%93%E5%BA%9C%E7%9C%8C', (err, $) => {
  if (err) {
    console.error(err);
    return;
  }

  const $tables = $('table.wikitable');

  log('Extract prefs and caps');

  const raw_prefs = [];
  const raw_regions_map = {};
  $tables.eq(2).find('tr').each(function () {
    const $tds = $(this).find('td');
    if (!$tds.length) return;
    if ($tds.length !== 11) throw new Error('Broken table[0]');
    raw_prefs.push([
      $(this).find('th').eq(0).text().trim(),
      $tds.eq(0).text().trim(),
      $tds.eq(2).text().trim(),
    ]);
    raw_regions_map[$tds.eq(4).text().trim()] = true;
  });

  console.log(JSON.stringify({
    raw_prefs,
    raw_regions: Object.keys(raw_regions_map),
  }));
});
