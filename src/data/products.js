export const categories = [
{slug:'necklaces',label:'Necklaces',short:'Necklaces',code:'N',prices:[19999,35999,49999,9999,59999],names:['Saanvi Gold Necklace','The Aarna Collar','Meher Layered Necklace','Tara Delicate Chain','The Noor Statement Necklace']},
{slug:'earrings',label:'Earrings',short:'Earrings',code:'E',prices:[1499,3999,5999,7999,8999],names:['Ira Drop Earrings','The Maya Hoops','Zoya Petal Earrings','Aisha Chand Earrings','The Diya Studs']},
{slug:'rings',label:'Rings',short:'Rings',code:'R',prices:[4999,8999,12999,19999,29999],names:['The Asha Ring','Nila Solitaire Ring','The Pari Band','Rhea Blossom Ring','The Sitara Ring']},
{slug:'bracelets',label:'Bracelets',short:'Bracelets',code:'B',prices:[1999,4999,7999,10999,14999],names:['The Anaya Bracelet','Mira Chain Bracelet','The Aditi Cuff','Kiara Beaded Bracelet','The Avani Bangle']},
{slug:'bridal',label:'Bridal Jewellery',short:'Bridal',code:'BR',prices:[14999,29999,44999,64999,89999],names:['The Amara Bridal Set','Suhana Celebration Set','The Rani Bridal Set','Jiya Heritage Set','The Avni Bridal Set']},
{slug:'pendant-sets',label:'Pendant Sets',short:'Pendant Sets',code:'P',prices:[3999,6999,9999,14999,19999],names:['The Inaya Pendant Set','Naina Pearl Pendant Set','The Esha Pendant Set','Ruhi Floral Pendant Set','The Sia Pendant Set']}
];
const descriptions=['A graceful silhouette made for moments worth remembering.','A delicate design that brings a little beauty to the everyday.','Thoughtful details give this piece its quietly expressive character.','An elegant form designed to complement your personal style.','A distinctive finishing touch for occasions both intimate and grand.'];
const modernNames={
  necklaces:['Bezel Solitaire Pendant Necklace','Gold Paperclip Chain Necklace','Oval Stone Pendant Necklace','Layered Gold Bar Necklace','Silver Solitaire Pendant Necklace'],
  earrings:['Classic Gold Hoop Earrings','Pave Huggie Earrings','Pearl Stud Earrings','Silver Open Hoop Earrings','Gold Teardrop Stud Earrings'],
  rings:['Solitaire Ring','Oval Solitaire Ring','Five Stone Stacking Ring','Silver Solitaire Ring','Gold Open Stone Ring'],
  bracelets:['Tennis Bracelet','Bezel Stone Chain Bracelet','Minimal Gold Cuff','Pearl Accent Bracelet','Silver Tennis Bracelet'],
  bridal:['Solitaire Bridal Necklace and Stud Set','Silver Bridal Pendant and Stud Set','Teardrop Bridal Necklace and Earrings','Pearl Bridal Pendant and Stud Set','Gold Bezel Bridal Set'],
  'pendant-sets':['Pearl Pendant Necklace','Teardrop Pendant Necklace','Silver Bezel Pendant Necklace','Mother of Pearl Pendant Necklace','Gold Bar Pendant Necklace']
};
export const products=categories.flatMap((c,ci)=>c.names.map((originalName,i)=>{
  const image=i===0?`/images/modern/${c.slug}.webp`:`/images/modern/products/${c.slug}-${String(i+1).padStart(2,'0')}.webp`;
  const featured=(ci<2&&i<2)||(ci>=2&&i===0);
  return {id:`${c.code}${i+1}`,slug:originalName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''),name:modernNames[c.slug][i],category:c.slug,price:c.prices[i],image,images:[image],featuredImage:featured?`/images/modern/featured/${c.slug}-${String(i+1).padStart(2,'0')}.webp`:null,description:`${descriptions[i]} This is an illustrative demo design; product details are sample information.`,material:'Illustrative sample; materials to be confirmed',productCode:`AJ-${c.code}00${i+1}`,featured,priceNote:'Sample price'};
}));
