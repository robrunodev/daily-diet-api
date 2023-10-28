import { describe, beforeAll, afterAll, it, beforeEach, expect } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { getCookie } from './utils'


describe('User and meal routes', () => {

    beforeAll(async () => {
        app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('should be able to create a new user', async () => {
        await request(app.server).post('/user').send({
            name: "Rod Bru"
        }).expect(201)
    })

    it('should be able to see resume of user meals', async () => {

        const { cookies } = await getCookie()

        await request(app.server).post('/meal')
            .set('Cookie', cookies)
            .send({
                name: "Pão no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                meal_date: "2023-10-22T13:34:00.000",
                inside_diet: true
            }).expect(201)

        const resumeResponse = await request(app.server)
            .get('/user/resume')
            .set('Cookie', cookies)
            .expect(200)

        expect(resumeResponse.body.resume).toEqual(expect.objectContaining({
            total_meals: 1,
            meals_inside_diet: 1,
            meals_outside_diet: 0
        }))
    })

    it('should be able to create a new meal', async () => {
        const { cookies } = await getCookie()

        await request(app.server).post('/meal')
            .set('Cookie', cookies)
            .send({
                name: "Tomate no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                meal_date: "2023-10-22T13:34:00.000",
                inside_diet: true
            }).expect(201)
    })

    it('should be able to list a specific meal', async () => {

        const { cookies, cookiesProps } = await getCookie()

        await request(app.server).post('/meal')
            .set('Cookie', cookies)
            .send({
                name: "Tomate no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                meal_date: "2023-10-22T13:34:00.000",
                inside_diet: true
            }).expect(201)

        const mealList = await request(app.server)
            .get('/meal')
            .set('Cookie', cookies)
            .expect(200)

        const mealId = mealList.body[0].id

        const specificMealResponse = await request(app.server)
            .get(`/meal/${mealId}`)
            .set('Cookie', cookies)


        expect(specificMealResponse.body).toEqual(expect.objectContaining({
            id: mealList.body[0].id,
            name: "Tomate no café",
            description: "Grãos com cereja no almoço para a dieta do sol",
            inside_diet: 1,
            user_id: cookiesProps.userId
        }))
    })

    it('should be able to list all user meals', async () => {

        const { cookies, cookiesProps } = await getCookie()

        await request(app.server).post('/meal')
            .set('Cookie', cookies)
            .send({
                name: "Tomate no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                meal_date: "2023-10-22T13:34:00.000",
                inside_diet: true
            }).expect(201)

        const allMealsResponse = await request(app.server)
            .get('/meal')
            .set('Cookie', cookies)
            .expect(200)

        const mealId = allMealsResponse.body[0].id

        expect(allMealsResponse.body).toEqual([
            expect.objectContaining({
                id: mealId,
                name: "Tomate no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                inside_diet: 1,
                user_id: cookiesProps.userId
            })
        ])
    })

    it('should be able to delete a specific meal', async () => {

        const { cookies } = await getCookie()

        await request(app.server).post('/meal')
            .set('Cookie', cookies)
            .send({
                name: "Tomate no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                meal_date: "2023-10-22T13:34:00.000",
                inside_diet: true
            }).expect(201)

        const mealList = await request(app.server)
            .get('/meal')
            .set('Cookie', cookies)
            .expect(200)

        const mealId = mealList.body[0].id

        await request(app.server)
            .delete(`/meal/${mealId}`)
            .set('Cookie', cookies)
            .expect(204)
    })

    it('should be able to update a specific meal', async () => {

        const { cookies, cookiesProps } = await getCookie()

        await request(app.server).post('/meal')
            .set('Cookie', cookies)
            .send({
                name: "Tomate no café",
                description: "Grãos com cereja no almoço para a dieta do sol",
                meal_date: "2023-10-22T13:34:00.000",
                inside_diet: true
            }).expect(201)

        const mealList = await request(app.server)
            .get('/meal')
            .set('Cookie', cookies)
            .expect(200)

        const mealId = mealList.body[0].id

        const mealUpdated = await request(app.server)
            .put(`/meal/${mealId}`).send({
                name: "Groselha no jantar",
                description: "lore lorem lorem",
                meal_date: "2023-10-25T14:34:00.000",
                inside_diet: false
            })
            .set('Cookie', cookies)
            .expect(200)

        expect(mealUpdated.body).toEqual([
            expect.objectContaining({
                id: mealId,
                name: "Groselha no jantar",
                description: "lore lorem lorem",
                inside_diet: 0,
            })
        ])
    })

})
