import { type Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meal', (table) => {
        table.uuid('id').primary().index()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.dateTime('meal_date').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.uuid('user_id')
        table.foreign('user_id').references('user.id')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meal')
}
