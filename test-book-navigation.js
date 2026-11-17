import { BOOK_NAV_DATA } from './js/components/bookNavigation.js';
import { INITIAL_PRODUCTS } from './js/data/products.js';

console.log('======================================================');
console.log('  HOMEHUB — BOOK-STYLE NAVIGATION SYSTEM VERIFICATION');
console.log('======================================================\n');

const bookKeys = Object.keys(BOOK_NAV_DATA);
console.log(`[1] Verifying Book Navigation Keys: found ${bookKeys.length} books`);
const expectedBooks = ['furniture', 'decor', 'lighting', 'living-room', 'bedroom', 'magazines'];

let allPassed = true;

for (const key of expectedBooks) {
  if (!BOOK_NAV_DATA[key]) {
    console.error(`✗ FAIL: Missing book navigation data for: ${key}`);
    allPassed = false;
  } else {
    const book = BOOK_NAV_DATA[key];
    console.log(`  ✓ PASS: Book [${key}] "${book.title}" | Volume: ${book.volume} | Left Links: ${book.leftLinks.length} | Right Links: ${book.rightLinks.length}`);
    
    // Check that there are NO images, cards or prices in links (Text links only requirement!)
    for (const link of [...book.leftLinks, ...book.rightLinks]) {
      if (link.price || link.image || link.img) {
        console.error(`✗ FAIL: Link contains image/price forbidden in book navigation: ${link.label}`);
        allPassed = false;
      }
      if (!link.target || !link.label) {
        console.error(`✗ FAIL: Link missing target or label in book [${key}]: ${JSON.stringify(link)}`);
        allPassed = false;
      }
    }
  }
}

console.log('\n[2] Verifying Product Catalogue Mappings:');
console.log(`  ✓ Total Initial Products: ${INITIAL_PRODUCTS.length}`);

if (allPassed) {
  console.log('\n======================================================');
  console.log('  ALL BOOK-STYLE NAVIGATION UNIT CHECKS PASSED (100%)');
  console.log('======================================================');
} else {
  console.error('\n✗ ERRORS FOUND IN BOOK-STYLE NAVIGATION UNIT CHECKS');
  process.exit(1);
}
