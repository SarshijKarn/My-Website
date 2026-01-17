const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔄 Auto-Versioning: Starting...');

// 1. Determine the new Version ID (Timestamp-based for reliability)
const now = new Date();
const pad = (num) => String(num).padStart(2, '0');
const version = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

console.log(`✅ Generated Version Timestamp: ${version}`);

// 2. Update index.html
const targetFile = 'index.html';

try {
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');

    // Regex to find ?v=... ending with a quote
    // Matches: ?v=10.0", ?v=9.0", etc.
    const regex = /(\?v=)[^"']+/g;

    // Check if we find matches
    if (regex.test(content)) {
      const updatedContent = content.replace(regex, `$1${version}`);
      fs.writeFileSync(targetFile, updatedContent);
      console.log(`🚀 Updated ${targetFile} to version: ${version}`);
    } else {
      console.log(`ℹ️ No "?v=" tags found in ${targetFile}. Nothing to update.`);
    }
  } else {
    console.error(`❌ File not found: ${targetFile}`);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error updating file:', err);
  process.exit(1);
}

console.log('✅ Auto-Versioning: Complete!');
