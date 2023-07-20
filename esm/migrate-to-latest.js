import path from "path";
import fs from "fs";
import { Kysely, PostgresDialect, Migrator, FileMigrationProvider } from "kysely";
import pg from "pg";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationFolder = 'esm/migrations'
// failed to migrate
// TypeError [ERR_INVALID_MODULE_SPECIFIER]: Invalid module "esm\migrations\2021_09_18_06_54_59_create_user.js" is not a valid package name imported from E:\code\bug-demo-migrator-window\node_modules\kysely\dist\esm\migration\file-migration-provider.js

// const migrationFolder = path.relative('.', 'esm/migrations')
// failed to migrate
// TypeError [ERR_INVALID_MODULE_SPECIFIER]: Invalid module "esm\migrations\2021_09_18_06_54_59_create_user.js" is not a valid package name imported from E:\code\bug-demo-migrator-window\node_modules\kysely\dist\esm\migration\file-migration-provider.js

// const migrationFolder = path.resolve(__dirname, 'migrations')
// failed to migrate
// Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'e:'

// const migrationFolder = path.join(__dirname, 'migrations')
// failed to migrate
// Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'e:'

async function migrateToLatest() {
    const db = new Kysely({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                host: 'localhost',
                user: 'postgres',
                database: 'postgres',
                password: 'postgres',
                port: 6543,
            }),
        }),
    });
    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs: fs.promises,
            path,
            migrationFolder,
        }),
    });
    const { error, results } = await migrator.migrateToLatest();
    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        }
        else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });
    if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
    }
    await db.destroy();
}
migrateToLatest();
