const jsonfile = require('jsonfile');
const glob = require('glob');
const path = require('path');

// Get the target version from the command line arguments
const targetVersion = process.argv[2];

if (!targetVersion) {
  console.error('Usage: node set-version.js <version>');
  process.exit(1);
}

// This function reads all package.json files to collect package names
async function getAllPackageNames() {
  return new Promise((resolve, reject) => {
    glob('packages/*/package.json', async (err, files) => {
      if (err) {
        reject('Error finding package.json files:', err);
        return;
      }

      const packageNames = [];
      for (const file of files) {
        try {
          const packageJson = await jsonfile.readFile(path.resolve(file));
          packageNames.push(packageJson.name);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
        }
      }
      resolve(packageNames);
    });
  });
}

// Function to update package.json dependencies
async function updatePackageJson(filePath, packageNames) {
  let fileUpdated = false;
  const packageJson = await jsonfile.readFile(filePath);

  // Update package version if it is in the packages list
  if (packageNames.includes(packageJson.name)) {
    packageJson.version = targetVersion;
    fileUpdated = true;
  }

  // Update dependencies, devDependencies, peerDependencies
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(depName => {
        if (packageNames.includes(depName)) {
          packageJson[depType][depName] = `^${targetVersion}`;
          fileUpdated = true;
        }
      });
    }
  });

  // Write the updated package.json back to file
  if (fileUpdated) {
    await jsonfile.writeFile(filePath, packageJson, { spaces: 2 });
    console.log(`Updated ${filePath}`);
  }
}

(async () => {
  const packageNames = await getAllPackageNames();

  glob('packages/**/package.json', async (err, files) => {
    if (err) {
      console.error('Error finding package.json files:', err);
      return;
    }

    // Update each found package.json
    for (const file of files) {
      await updatePackageJson(path.resolve(file), packageNames);
    }
  });
})();