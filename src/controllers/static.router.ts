import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }

          img {
            height: 50%;
          }
        </style>
      </head>
      <body>
        <img src="https://cdn.nierot.com/-/kokopelli.png" />
      </body>
    </html>
  `)
})

export default router