import { Knex, knex as setupKnex } from 'knex'
import path from 'path'
import { env } from './env'

const dbConnection = {
    connection:
        env.DATABASE_CLIENT === 'sqlite' ? {
            filename: env.DATABASE_URL,
        } : env.DATABASE_URL
}

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    ...dbConnection,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: path.resolve('db', 'migrations')
    }
}

export const knex = setupKnex(config)
