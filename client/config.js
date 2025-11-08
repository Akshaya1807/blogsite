import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const API =
  publicRuntimeConfig?.PRODUCTION
    ? `${publicRuntimeConfig.PRODUCTION_SITE}/api`
    : `${publicRuntimeConfig.DEVELOPMENT_SITE}/api`;

export const APP_NAME = publicRuntimeConfig?.APP_NAME || "TechBlog";

export const DOMAIN =
  publicRuntimeConfig?.PRODUCTION
    ? publicRuntimeConfig.DOMAIN_PRODUCTION
    : publicRuntimeConfig.DOMAIN_DEVELOPMENT;

// Debugging log to confirm loading
console.log("✅ Loaded config.js:");
console.log("API =", API);
console.log("DOMAIN =", DOMAIN);
