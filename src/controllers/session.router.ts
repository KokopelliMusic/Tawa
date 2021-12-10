import { Router } from "express"

const router = Router()

router.get('/', (req, res) => {
  res.json({
    msg: 'Session router'
  })
})

router.get('/all', (req, res) => {
  res.json({
    msg: 'Sessions router'
  })
})

export default router