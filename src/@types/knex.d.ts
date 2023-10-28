// eslint-disable-next-line
import { Knex } from 'knex'

interface UserTable {
  id: string
  name: string
}
interface MealTable {
  id: string
  name: string
  description: string
  meal_date: Date
  inside_diet: boolean
  created_at: string
  user_id: string
}

declare module 'knex/types/tables' {
  export interface Tables {
    user: UserTable
    meal: MealTable
  }
}
