const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./types');
const courses = require('./mock');

const app = express();

app.get('/', function name(req, res) {
  res.json({ ok: true });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: {
      db: {
        courses,
      },
    },
  })
);

app.listen(3000, function name(params) {
  console.log('listening');
});
