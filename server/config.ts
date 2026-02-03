import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const CONFIG_PATH = path.join(process.cwd(), 'config.yml');

interface Config {
  admin_password?: string;
  database_url?: string;
}

export function getConfig(): Config {
  try {
    const config: Config = {};
    
    // 1. Try reading from config.yml
    if (fs.existsSync(CONFIG_PATH)) {
      const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
      const loaded = yaml.load(fileContents) as Config;
      if (loaded.admin_password) config.admin_password = loaded.admin_password;
      if (loaded.database_url) config.database_url = loaded.database_url;
    }
    
    // 2. Override/Fallback to environment variables
    if (process.env.ADMIN_PASSWORD) config.admin_password = process.env.ADMIN_PASSWORD;
    if (process.env.DATABASE_URL) config.database_url = process.env.DATABASE_URL;
    if (process.env.EXTERNAL_DATABASE_URL) config.database_url = process.env.EXTERNAL_DATABASE_URL;
    if (!config.database_url) config.database_url = "postgresql://licen_feedforce:855e1c39c64c9075f4255d09a2c73441b36ea160@t8mxt6.h.filess.io:5434/licen_feedforce";
    return config;
  } catch (err) {
    console.error("Error reading config:", err);
    return { admin_password: 'admin0', database_url: process.env.DATABASE_URL };
  }
}
