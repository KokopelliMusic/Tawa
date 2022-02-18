import express from 'express'
import { getCurrentlyPlaying, getList } from './redis'

export const cacheRouter = express.Router()

cacheRouter.get('/history/:session', async (req, res) => {
    const session = req.params.session
    const list    = await getList(req.redis, session)
    
    res.json(list)
})

cacheRouter.get('/playing/:session', async (req, res) => {
    const session = req.params.session
    const song    = await getCurrentlyPlaying(req.redis, session)

    res.json(song)
})