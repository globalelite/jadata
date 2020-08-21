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
  const raw_capitals_map = {};
  $tables.eq(2).find('tr').each(function () {
    const $tds = $(this).find('td');
    if (!$tds.length) return;
    if ($tds.length !== 11) throw new Error('Broken table[0]');
    const capital = $tds.eq(2).text().trim();
    const region = $tds.eq(4).text().trim();
    raw_prefs.push({
      name: $(this).find('th>a').eq(0).text().trim(),
      read: $tds.eq(0).text().trim(),
      capital,
      region,
    });
    raw_capitals_map[capital] = true;
    raw_regions_map[region] = true;
  });

  const raw_capital_names = Object.keys(raw_capitals_map);
  const raw_region_names = Object.keys(raw_regions_map);
  const names = raw_capital_names.concat(raw_region_names);

  client.fetch('https://yomi-tan.jp/api/yomi.php', {
    ic: 'UTF-8',
    oc: 'UTF-8',
    k: 'h',
    n: 1,
    t: names.join('、'),
  }, (err2, _$, _res, body) => {
    if (err2) {
      console.error(err2);
      return;
    }

    const reads = body.split('、');
    if (names.length !== reads.length) {
      console.error('Mismatch size');
    }

    const to_read = {};
    names.forEach((name, i) => {
      to_read[name] = reads[i];
    });

    console.log(JSON.stringify({
      raw_prefs,
      raw_capitals: raw_capital_names.map((name) => ({
        name,
        read: to_read[name],
      })),
      raw_regions: raw_region_names.map((name) => ({
        name,
        read: to_read[name],
      })),
    }));
  });
});
