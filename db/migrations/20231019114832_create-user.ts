import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', (table) => {
        table.uuid('id').primary().index()
        table.text('name').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.uuid('session_id').after('id').index()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user')
}
