import {existsSync,readFileSync} from 'node:fs';
const source=readFileSync('src/data/products.js','utf8');
const slugs=[...source.matchAll(/slug:'([^']+)'/g)].map(m=>m[1]);
let missing=[]; for(const slug of slugs) for(let i=1;i<=5;i++){const path=`public/images/products/${slug}-0${i}.png`;if(!existsSync(path))missing.push(path)}
for(const path of ['public/images/hero/editorial-hero.png','public/images/products/necklaces-03.png','public/images/products/bridal-03.png','public/images/products/pendant-sets-03.png'])if(!existsSync(path))missing.push(path);
if(missing.length){console.error('Missing images:',missing);process.exit(1)}console.log(`All ${slugs.length*5} product images and page images exist.`);
