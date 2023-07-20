"use strict";

const path = require("path");
const fs_1 = require("fs");
const kysely_1 = require("kysely");
const pg_1 = require("pg");

async function migrateToLatest() {
    const db = new kysely_1.Kysely({
        dialect: new kysely_1.PostgresDialect({
            pool: new pg_1.Pool(
                {
                    host: 'localhost',
                    user: 'postgres',
                    database: 'postgres',
                    password: 'postgres',
                    port: 6543,
                }
            ),
        }),
    });
    const migrator = new kysely_1.Migrator({
        db,
        provider: new kysely_1.FileMigrationProvider({
            fs: fs_1.promises,
            path,
            migrationFolder: path.join(__dirname, 'migrations'),
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
