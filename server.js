const express = require('express');
require('dotenv').config();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const checkScope = require('express-jwt-authz');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),

  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const app = express();

app.get('/public', function(req, res) {
  res.json({
    message: 'hello from a public api!'
  });
});

app.get('/private', checkJwt, function(req, res) {
  res.json({
    message: 'hello from a private api!'
  });
});

app.get('/courses', checkJwt, checkScope(['read:courses']), function(req, res) {
  res.json({
    courses: [
      { id: 1, title: 'Building Apps with React and Redux' },
      { id: 1, title: 'Creating Reusable React Components' }
    ]
  });
});

app.listen(3001);

console.log('API server listening on ' + process.env.REACT_APP_API_URL);
