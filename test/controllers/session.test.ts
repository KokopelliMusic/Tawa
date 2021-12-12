
import request from 'supertest'
import { app } from '../../src'

describe('Test status codes', () => {
  it('should return a 200', async () => {
    const response = await request(app).get('/session')
    expect(response.statusCode).toBe(200)
  })

  it('should not return 404', async () => {
    const response = await request(app).get('/session')
    expect(response.statusCode).not.toBe(404)
  })

  it('post new should return 200', async () => {
    const response = await request(app).post('/session/new')
    expect(response.statusCode).toBe(200)
  })

  it('post claim should return 400 without body', async () => {
    const response = await request(app).post('/session/claim')
    expect(response.statusCode).toBe(400)
  })

  it('get all should return 200', async () => {
    const response = await request(app).get('/session/all')
    expect(response.statusCode).toBe(200)
  })
})

describe('Test claiming a session', () => {
  it('should return a 400 without body', async () => {
    const response = await request(app)
      .post('/session/claim')
      
    expect(response.statusCode).toBe(400)
  })

  it('should return a 400 with bad body', async () => {
    const response = await request(app)
      .post('/session/claim')
      .send({ oof: 'yeet' })

    expect(response.statusCode).toBe(400)
  })

  let id = ''

  it('should be able to create a new session id', async () => {
    const response = await request(app)
      .post('/session/new')

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBeDefined()
    id = response.body.id
  })

  it('should be able to claim a session', async () => {
    const response = await request(app)
      .post('/session/claim')
      .send({ id, userId: 1, playlistId: 1 })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.status).toBe(200)
  })

  it('should contain the new session code when calling /all', async () => {
    const response = await request(app).get('/session/all')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })
})