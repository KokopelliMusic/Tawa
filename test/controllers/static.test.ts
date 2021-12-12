import request from 'supertest'
import { app } from '../../src/index'

describe('Test the static index page', () => {
  test('It should response the GET method', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })

  test('It does not respond to a POST method', async () => {
    const response = await request(app).post('/')
    expect(response.statusCode).toBe(404)
  })
})