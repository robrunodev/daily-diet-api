import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/checkUserIdExists'

export async function userRoutes(app: FastifyInstance) {
    app.post('/', async (req, res) => {

        const createUserBodySchema = z.object({
            name: z.string(),
        })

        const { name } = createUserBodySchema.parse(req.body)

        let userId = req.cookies.userId

        if (!userId) {
            userId = randomUUID()
            res.cookie('userId', userId, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7
            })
        }

        await knex('user').insert({
            id: userId,
            name,
        })

        res.status(201).send()
    })

    app.get('/resume', {
        preHandler: checkUserIdExists
    }, async (req, res) => {

        const userId = req.cookies.userId

        const totalMeals = await knex('meal')
            .where({
                user_id: userId,
            }).count({ total_meals: 'id' }).first()

        const mealsHasDiet = await knex('meal')
            .where({ user_id: userId, inside_diet: true })
            .count({ meals_inside_diet: 'inside_diet' }).first()

        const mealsHasNotDiet = await knex('meal')
            .where({ user_id: userId, inside_diet: false })
            .count({ meals_outside_diet: 'id' }).first()

        return { resume: { ...totalMeals, ...mealsHasDiet, ...mealsHasNotDiet } }
    })
}
