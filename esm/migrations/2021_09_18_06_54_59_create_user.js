import { sql } from "kysely";
export async function up(db) {
    await db.schema
        .createTable('user')
        .addColumn('user_id', 'uuid', (col) => col.primaryKey().defaultTo((0, sql)`gen_random_uuid()`))
        .addColumn('first_name', 'text')
        .addColumn('last_name', 'text')
        .addColumn('email', 'text', (col) => col.unique())
        .addColumn('created_at', 'timestamp', (col) => col.defaultTo((0, sql)`NOW()`))
        .execute();
}
export async function down(db) {
    await db.schema.dropTable('user').execute();
}
