import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meal', (table) => {
        table.boolean('inside_diet').notNullable().defaultTo(false)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meal', (table) => {
        table.dropColumn('inside_diet')
    })
}
