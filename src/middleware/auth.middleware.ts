import jwt from 'jsonwebtoken'
import jwksRsa from 'jwks-rsa'


// export const checkJwt = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
//   }),
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//   algorithms: ['RS256']
// })

const client = jwksRsa({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
})

// @ts-expect-error ik weet toch niet wat voor types deze troep moet hebben
export const getKey = (header, callback) => {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err, null)
    }
    // @ts-expect-error Kut jsonwebtoken library is niet compleet
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

export const isTokenValid = async (token: string) => {
  if (token) {
    const bearerToken = token.split(" ")

    const result = new Promise(resolve => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.AUTH0_AUDIENCE,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"]
        },
        (error, decoded) => {
          if (error) {
            resolve({ error })
          }
          if (decoded) {
            resolve({ decoded })
          }
        }
      )
    })

    return result
  }

  return { error: "No token provided" }
}

// https://auth0.com/blog/node-js-and-typescript-tutorial-secure-an-express-api/
// https://auth0.com/blog/build-and-secure-a-graphql-server-with-node-js/#Securing-a-GraphQL-Server-with-Auth0