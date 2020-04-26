const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const deepmerge = require('deepmerge');
const fs = require('fs');
const db = require('./db');
const Course = require('./types/Courses/courses.model');
const User = require('./types/User/user.model');

const courseSchema = fs.readFileSync('./types/Courses/courses.schema.gql', {
  encoding: 'utf-8',
});

const userSchema = fs.readFileSync('./types/User/user.schema.gql', {
  encoding: 'utf-8',
});

const app = express();

const rootSchema = gql`
  type Query {
    ping: String
  }
  type Mutation {
    ping: String
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;
const schema = makeExecutableSchema({
  typeDefs: [rootSchema, courseSchema, userSchema],
  resolvers: deepmerge.all([
    require('./types/Courses/courses.resolver'),
    require('./types/User/user.resolver'),
  ]),
});

async function start() {
  const database = await db('mongodb://localhost:27017/graphql-facilito');
  const apolloServer = new ApolloServer({
    schema,
    context(args) {
      return auth(args.req, User).then((user) => {
        return {
          ...args,
          db: database,
          user,
          models: {
            Course,
            User,
          },
        };
      });
    },
  });

  apolloServer.applyMiddleware({ app });

  app.get('/', function name(req, res) {
    res.send({ hola: 'mundo' });
  });

  app.listen(3000, function name(params) {
    console.log('listenning');
  });
}

const jwt = require('jsonwebtoken');

async function auth(req, User) {
  const { authorization } = req.headers;
  if (!authorization) {
    return null;
  }
  const [_, token] = authorization.split('Bearer ');
  const { id } = jwt.verify(token, 'asdasd');
  if (!jwt.verify(token, 'asdasd')) {
    return null;
  }

  const user = await User.findById(id).select('-hashedPassword').lean().exec();

  return user;
}

start();
