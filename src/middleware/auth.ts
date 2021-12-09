import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'

export const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
})

// https://auth0.com/blog/node-js-and-typescript-tutorial-secure-an-express-api/
// https://auth0.com/blog/build-and-secure-a-graphql-server-with-node-js/#Securing-a-GraphQL-Server-with-Auth0