const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔄 Auto-Versioning: Starting...');

// 1. Determine the new Version ID
let version = '';

try {
  // Priority 1: Vercel Environment Variable (Best for deployments)
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    version = process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7);
    console.log(`✅ Using Vercel Commit Hash: ${version}`);
  }
  // Priority 2: Local Git Repository (Best for local dev)
  else {
    try {
      version = execSync('git rev-parse --short HEAD').toString().trim();
      console.log(`✅ Using Local Git Hash: ${version}`);
    } catch (gitError) {
      // If git command fails (no git or empty repo), fall through
      throw new Error('Git command failed');
    }
  }
} catch (error) {
  // Priority 3: Fallback to Timestamp (Safety net)
  version = Date.now().toString();
  console.log(`⚠️ Git hash not found. Using Timestamp: ${version}`);
}

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
