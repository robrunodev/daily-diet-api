import { type FastifyInstance } from 'fastify/types/instance'
import { checkUserIdExists } from '../middlewares/checkUserIdExists'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealRoutes(app: FastifyInstance) {

    app.addHook('preHandler', checkUserIdExists)

    app.post('/', async (req, res) => {

        const createMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            meal_date: z.coerce.date(),
            inside_diet: z.boolean()
        })

        const { name, meal_date, description, inside_diet } = createMealSchema.parse(req.body)

        const { userId } = req.cookies

        await knex('meal').insert({
            id: randomUUID(),
            name,
            description,
            meal_date,
            inside_diet,
            user_id: userId,
        })

        return res.status(201).send()

    })

    app.put('/:id', async (req, res) => {

        const editMealSchema = z.object({
            name: z.string(),
            description: z.string(),
            meal_date: z.coerce.date(),
            inside_diet: z.boolean()
        })

        const { name, meal_date, description, inside_diet } = editMealSchema.parse(req.body)

        const mealIdSchema = z.object({
            id: z.string()
        })

        const { id } = mealIdSchema.parse(req.params)
        const { userId } = req.cookies


        const mealChanged = await knex('meal')
            .where({ id, user_id: userId })
            .update({
                name,
                meal_date,
                description,
                inside_diet
            }, ['id', 'name', 'meal_date', 'description', 'inside_diet'])
            

        return res.status(200).send(mealChanged)
    })

    app.get('/:id', async (req, res) => {

        const { userId } = req.cookies

        const mealIdSchema = z.object({
            id: z.string()
        })

        const { id } = mealIdSchema.parse(req.params)

        const meal = await knex('meal')
            .where({ id, user_id: userId })
            .first()

        return meal ?? {}
    })

    app.get('/', async (req, res) => {

        const { userId } = req.cookies

        const meals = await knex('meal')
            .where({ user_id: userId })
            .select()

        return meals
    })

    app.delete('/:id', async (req, res) => {

        const { userId } = req.cookies

        const mealIdSchema = z.object({ id: z.string() })

        const { id } = mealIdSchema.parse(req.params)

        await knex('meal')
            .where({ user_id: userId, id })
            .del(['id', 'name'])

        return res.status(204).send()
    })

}