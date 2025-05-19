#!/usr/bin/env node
// Script to auto-generate TypeScript definitions from CSV
const fs = require('fs');
const path = require('path');

// Paths
const csvPath = path.join(__dirname, '../src/data/MNTEST Items.csv');
const outPath = path.join(__dirname, '../src/data/mntest-items.ts');

// Read CSV (strip BOM)
let content = fs.readFileSync(csvPath, 'utf-8');
content = content.replace(/^\uFEFF/, '');
const rawLines = content.split(/\r?\n/);
if (rawLines.length < 2) {
  console.error('CSV file is empty or missing');
  process.exit(1);
}
// Skip empty lines (no header row expected in CSV)
const lines = rawLines.filter((l) => l.trim() !== '');
console.log(`Parsed ${rawLines.length - 1} raw lines, ${lines.length} non-empty items.`);

// Helper to split CSV line respecting quoted commas
function splitCSV(line) {
  return line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(f => f.replace(/^"|"$/g, ''));
}

// Define MI categories to infer type (updated trait names)
const MI_CATEGORIES = [
  'Gross Bodily',
  'Fine Bodily',
  'Interpersonal',
  'Logical',
  'Linguistic',
  'Graphic Visual',
  'Spatial Visual',
  'Musical',
  'Intrapersonal',
  'Naturalistic'
];

// Parse items (only first 76 records)
let items = lines.map((line, idx) => {
  const [text, trait] = splitCSV(line);
  const type = MI_CATEGORIES.includes(trait) ? 'MI' : 'MN';
  return { id: idx + 1, text, type, traitCategory: trait };
});
// Trim to expected 76 items
if (items.length > 76) {
  console.warn(`Parsed ${items.length} items, trimming to first 76.`);
  items = items.slice(0, 76);
}

// Build output
const header = `/**
 * Auto-generated from MNTEST Items.csv
 * Contains all test items for the Multiple Intelligences and Multiple Natures assessment.
 */`;

const interfaceDef = `/**
 * Represents a single test item in the MNTEST assessment
 */
export interface MNTestItem {
  /** Unique identifier for the item */
  id: number;
  /** The question text presented to the user */
  text: string;
  /** Whether this is a Multiple Intelligence or Multiple Nature item */
  type: 'MI' | 'MN';
  /** The specific trait category this item measures */
  traitCategory: string;
}`;

const itemsArray = `export const MNTEST_ITEMS: MNTestItem[] = [
${items.map(i => `  {
    id: ${i.id},
    text: ${JSON.stringify(i.text)},
    type: '${i.type}',
    traitCategory: ${JSON.stringify(i.traitCategory)}
  }`).join(',\n')}
];`;

const extras = `/** Just the Multiple Intelligence items */
export const MI_ITEMS = MNTEST_ITEMS.filter(item => item.type === 'MI');

/** Just the Multiple Nature items */
export const MN_ITEMS = MNTEST_ITEMS.filter(item => item.type === 'MN');

/**
 * Returns test items grouped by their trait category
 */
export function getItemsByCategory(): Record<string, MNTestItem[]> {
  return MNTEST_ITEMS.reduce((acc, item) => {
    if (!acc[item.traitCategory]) acc[item.traitCategory] = [];
    acc[item.traitCategory].push(item);
    return acc;
  }, {} as Record<string, MNTestItem[]>);
}`;

// Write file
const output = [header, '', interfaceDef, '', itemsArray, '', extras].join('\n');
fs.writeFileSync(outPath, output, 'utf-8');
console.log('Generated TS file:', outPath);