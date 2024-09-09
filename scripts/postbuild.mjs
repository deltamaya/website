import rss from './rss.mjs'
console.log(`Writing RSS feed`);
async function postbuild() {
  await rss()
}

postbuild()
