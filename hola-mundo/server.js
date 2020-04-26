const express = require('express');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  graphql,
} = require('graphql');

const app = express();

const courseType = new GraphQLObjectType({
  name: 'Course',
  fields: {
    title: {
      type: GraphQLString,
    },
    views: { type: GraphQLInt },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      message: {
        type: GraphQLString,
        resolve(parent, args, ctx) {
          return 'hola';
        },
      },
      course: {
        type: courseType,
        resolve() {
          return { title: 'Curso', views: 1000 };
        },
      },
    },
  }),
});

app.get('/', function name(req, res) {
  graphql(
    schema,
    `
      {
        message
        course {
          title
        }
      }
    `
  ).then(
    (r) => {
      res.status(200).json(r);
    },
    (err) => {
      res.status(500).send(err);
    }
  );
});

app.listen(3000, function name(params) {
  console.log('listening');
});
