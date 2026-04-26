import mongoose from "mongoose";
import dotenv from "dotenv";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

dotenv.config();

// ── Dynamically import Data.js from the frontend src folder ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the data
const dataPath = resolve(__dirname, "../src/data/Data.js");
const { data } = await import(dataPath);

// ── Import the Media model ────────────────────────────────────
import Media from "./models/Media.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  await Media.deleteMany({});
  console.log("🗑  Cleared existing media");

  // ── Sanitize each item ────────────────────────────────────
  const docs = data.map((item) => {
    const doc = { ...item };

    // Fix seasons: episodesPerSeason must be all numbers
    if (doc.seasons) {
      const eps = doc.seasons.episodesPerSeason;
      if (Array.isArray(eps)) {
        // Filter out any non-numeric entries, parse strings like "12" to numbers
        const cleaned = eps
          .map((e) => (typeof e === "number" ? e : parseInt(e, 10)))
          .filter((e) => !isNaN(e));

        doc.seasons = {
          total: doc.seasons.total ?? cleaned.length,
          episodesPerSeason: cleaned,
        };
      } else {
        // If episodesPerSeason is missing or malformed, drop seasons entirely
        delete doc.seasons;
      }
    }

    return doc;
  });

  await Media.insertMany(docs, { ordered: false });
  console.log(`✅ Inserted ${docs.length} media items`);

  await mongoose.disconnect();
  console.log("✅ Done — database seeded successfully");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});