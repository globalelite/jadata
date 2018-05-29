const client = require('cheerio-httpcli');

const log = (str) => console.error(`-- ${str}`);

log('Fetch joyo_kanji');

client.fetch('https://ja.wikipedia.org/wiki/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7', (err, $) => {
  if (err) {
    console.error(err);
    return;
  }

  const $tables = $('table.wikitable');

  log('Extract chars');

  const raw_chars = [];
  $tables.eq(0).find('tr').each(function () {
    const $tds = $(this).find('td');
    if (!$tds.length) return;
    if ($tds.length !== 9) throw new Error('Broken table[0]');
    if (!$tds.eq(0).find('span').remove().end().text().length) return;
    raw_chars.push([
      $tds.eq(1).text().trim().split(/\s+/)[0].split('-'),
      $tds.eq(8).text().replace(/\s/g, ' ').trim().split('、'),
    ]);
  });

  log('Extract words');

  const raw_words = [];
  $tables.eq(1).find('tr').each(function () {
    const $tds = $(this).find('td');
    if (!$tds.length) return;
    if ($tds.length !== 5) throw new Error('Broken table[1]');
    if (!$tds.eq(0).find('span').remove().end().text().length) return;
    raw_words.push([
      $tds.eq(2).text().trim(),
      $tds.eq(1).text().trim(),
    ]);
  });

  console.log(JSON.stringify({
    raw_chars,
    raw_words,
  }));
});
