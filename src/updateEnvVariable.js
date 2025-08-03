const fs = require('fs');
const path = require('path');

/**
 * Updates or appends a key=value pair in a .env file.
 *
 * @param {string} key - The environment variable key to update or append.
 * @param {string} value - The value to set for the key.
 * @param {string} envFilePath - Absolute or relative path to your .env file.
 */
function updateEnvVariable(key, value, envFilePath = '.env') {
  const fullPath = path.resolve(envFilePath);

  // Create the .env file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, `${key}=${value}\n`);
    console.log(`Created .env and added: ${key}=${value}`);
    return;
  }

  let envContent = fs.readFileSync(fullPath, 'utf8');
  const regex = new RegExp(`^${key}=.*$`, 'm');

  if (regex.test(envContent)) {
    // Key exists → replace
    envContent = envContent.replace(regex, `${key}=${value}`);
    console.log(`Updated ${key} to ${value}`);
  } else {
    // Key doesn't exist → append
    envContent += `\n${key}=${value}`;
    console.log(`Appended ${key}=${value}`);
  }

  fs.writeFileSync(fullPath, envContent, 'utf8');
}

module.exports = updateEnvVariable;
