import { defineConfig } from '@prisma/config';

export default defineConfig({
    datasource: {
        url: (() => {
            const url = process.env.DATABASE_URL;
            if (!url) throw new Error("DATABASE_URL environment variable is missing in prisma.config.ts");
            return url;
        })(),
    },
});
