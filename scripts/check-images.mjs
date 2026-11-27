import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { categories, products } from '../src/data/products.js';
const images = [
  ...products.map(p => ({role:`product ${p.id}`, path:p.image})),
  ...products.filter(p=>p.featured).map(p => ({role:`featured ${p.id}`, path:p.featuredImage})),
  ...categories.map(c => ({role:`category ${c.slug}`, path:`/images/modern/categories/${c.slug==='necklaces'?'necklaces-editorial':c.slug==='bridal'?'bridal-editorial':c.slug}.webp`})),
  ...['about-story','collection-hero'].map(n => ({role:`editorial ${n}`,path:`/images/modern/editorial/${n}.webp`})),
  ...['necklace','earrings','ring','bracelet','pearl'].map(n => ({role:`showcase ${n}`,path:`/images/modern/showcase/${n}.webp`}))
];
const paths = new Map(), hashes = new Map(), errors=[];
for(const image of images){
  if(!image.path || !existsSync(`public${image.path}`)){errors.push(`Missing: ${image.role}: ${image.path}`);continue}
  if(paths.has(image.path))errors.push(`Repeated path: ${image.role} and ${paths.get(image.path)}`); else paths.set(image.path,image.role);
  const hash=createHash('sha256').update(readFileSync(`public${image.path}`)).digest('hex');
  if(hashes.has(hash))errors.push(`Duplicate file: ${image.role} and ${hashes.get(hash)}`); else hashes.set(hash,image.role);
}
for(const product of products) if(product.images.length!==1 || product.images[0]!==product.image) errors.push(`Unexpected product-detail mapping: ${product.id}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Verified ${images.length} unique active images: ${products.length} products, ${products.filter(p=>p.featured).length} featured, ${categories.length} categories, 2 editorial, 5 showcase.`);
