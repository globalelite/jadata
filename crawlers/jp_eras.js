const client = require('cheerio-httpcli');

const log = (str) => console.error(`-- ${str}`);

log('Fetch jp_era');

client.fetch('https://ja.wikipedia.org/wiki/%E5%85%83%E5%8F%B7%E4%B8%80%E8%A6%A7_(%E6%97%A5%E6%9C%AC)', (err, $) => {
  if (err) {
    console.error(err);
    return;
  }

  const $tables = $('table.wikitable');

  log('Extract eras');

  const raw_eras = [];

  $tables.each(function (i) {
    if (!i) return;
    $(this).find('tr').each(function () {
      const $ths = $(this).find('th');
      const $tds = $(this).find('td');
      if ($ths.length !== 1 || $tds.length < 5) return;
      const $a = $ths.eq(0).find('a');
      if (!$a.length) return;
      raw_eras.push([
        $a.text().trim(),
        $tds.eq(0).text().trim(),
      ]);
    });
  });

  console.log(JSON.stringify({
    raw_eras,
  }));
});
