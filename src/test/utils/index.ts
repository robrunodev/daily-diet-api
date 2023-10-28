import { app } from "../../app"
import request from 'supertest'


interface Cookie {
    userId: string
    'Max-Age': string
    'Path': string
}

export const getCookie = async () => {
    const createMealResponse = await request(app.server)
        .post('/user')
        .send({
            name: "Rod Bru teste",
        })

    const cookies = createMealResponse.get('Set-Cookie')

    const cookiesArray = cookies[0].split(';')

    const cookieFormattedToObject = cookiesArray.map((cookie) => {
        const keyValueArr = cookie.split('=')
        const key = keyValueArr[0].trim()
        const value = keyValueArr[1].trim()
        return {
            [key]: value
        };
    })

    const cookiesProps: Cookie = Object.assign({}, ...cookieFormattedToObject)

    return {
        cookies,
        cookiesProps
    }
}