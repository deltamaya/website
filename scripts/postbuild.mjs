import rss from './rss.mjs'
console.log(`Writing RSS feed to`);
async function postbuild() {
  await rss()
}

postbuild()
