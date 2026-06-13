#!/usr/bin/env node
/**
 * Data Validation Script (FR-013)
 * Validates players.json schema correctness before deployment.
 * Run: node scripts/validate-data.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "src", "data", "players.json");

const VALID_POSITIONS = new Set(["GK", "DEF", "MID", "FWD"]);
let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`  ❌ ${msg}`);
  errors++;
}
function warn(msg) {
  console.warn(`  ⚠️ ${msg}`);
  warnings++;
}

console.log("🔍 Validating players.json...\n");

let data;
try {
  const raw = readFileSync(dataPath, "utf-8");
  data = JSON.parse(raw);
} catch (e) {
  error(`Failed to read or parse players.json: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(data)) {
  error("Root value must be an array of players");
  process.exit(1);
}

console.log(`📊 Found ${data.length} player records\n`);

const ids = new Set();
let nullMVCount = 0;
let nullClubCount = 0;
let nullHeightCount = 0;

for (let i = 0; i < data.length; i++) {
  const p = data[i];
  const prefix = `Player[${i}] (${p.name || "no name"})`;

  if (!p.id || typeof p.id !== "string") error(`${prefix}: missing or invalid "id"`);
  if (!p.name || typeof p.name !== "string") error(`${prefix}: missing or invalid "name"`);
  if (typeof p.age !== "number") error(`${prefix}: "age" must be a number`);
  if (typeof p.nationality !== "string" || p.nationality.length !== 3) error(`${prefix}: "nationality" must be a 3-letter country code`);
  if (!VALID_POSITIONS.has(p.position)) error(`${prefix}: "position" must be one of GK, DEF, MID, FWD (got "${p.position}")`);
  if (typeof p.worldCupAppearances !== "number" || p.worldCupAppearances < 0) error(`${prefix}: "worldCupAppearances" must be a non-negative number`);
  if (typeof p.source !== "string" || p.source.length === 0) error(`${prefix}: missing or empty "source" field`);

  if (typeof p.age === "number" && (p.age < 15 || p.age > 55)) warn(`${prefix}: age ${p.age} is outside typical range (15-55)`);
  if (typeof p.height === "number" && (p.height < 150 || p.height > 215)) warn(`${prefix}: height ${p.height}cm is outside typical range (150-215)`);
  if (typeof p.marketValueEUR === "number" && p.marketValueEUR < 0) error(`${prefix}: marketValueEUR cannot be negative`);

  if (p.marketValueEUR === null || p.marketValueEUR === undefined) nullMVCount++;
  if (p.club === null || p.club === undefined) nullClubCount++;
  if (p.height === null || p.height === undefined) nullHeightCount++;

  if (ids.has(p.id)) error(`${prefix}: duplicate ID "${p.id}"`);
  if (p.id) ids.add(p.id);
}

console.log(`\n📈 Summary:`);
console.log(`  Players with null market value: ${nullMVCount}`);
console.log(`  Players with null club (Free Agent): ${nullClubCount}`);
console.log(`  Players with null height: ${nullHeightCount}`);
console.log(`  Unique player IDs: ${ids.size}`);
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);

if (errors > 0) {
  console.log(`\n❌ VALIDATION FAILED — ${errors} error(s) found`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n✅ VALIDATION PASSED with ${warnings} warning(s)`);
  process.exit(0);
} else {
  console.log(`\n✅ VALIDATION PASSED — no issues found`);
  process.exit(0);
}