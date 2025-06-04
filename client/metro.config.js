const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Enable support for .cjs files
defaultConfig.resolver.sourceExts.push('cjs');

// Disable experimental package exports to avoid resolution issues
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
