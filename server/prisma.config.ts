import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env so DATABASE_URL is available when Prisma CLI runs this config
dotenv.config({ path: path.resolve(__dirname, '.env') });

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL environment variable is missing in prisma.config.ts');

export default defineConfig({
    datasource: {
        url,
    },
});
                                                                                                                                                                                              