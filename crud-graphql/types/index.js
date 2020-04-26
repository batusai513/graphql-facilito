const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  graphql,
} = require('graphql');
const {
  courseType,
  coursesInputType,
  courseInputType,
  createCourseInputType,
  updateCourseInputType,
} = require('./course');
const compose = require('../utils/compose');

const rootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getCouses: {
      type: compose(GraphQLNonNull, GraphQLList, GraphQLNonNull)(courseType),
      args: {
        input: {
          type: coursesInputType,
        },
      },
      resolve(_, { input = {} }, ctx) {
        const { limit, page } = input;
        if (page !== undefined) {
          return ctx.db.courses.slice(page * limit, (page + 1) * limit);
        }
        return ctx.db.courses;
      },
    },
    course: {
      type: courseType,
      args: {
        input: {
          type: courseInputType,
        },
      },
      resolve(parent, { input }, ctx) {
        return ctx.db.courses.find((course) => course.id === input.id);
      },
    },
  },
});

const mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createCourse: {
      type: new GraphQLNonNull(courseType),
      args: {
        input: {
          type: createCourseInputType,
        },
      },
      resolve(_, { input }, ctx) {
        const newCourse = { ...input, id: Date.now(), views: 0 };
        ctx.db.courses.push(newCourse);
        return newCourse;
      },
    },
    updateCourse: {
      type: new GraphQLNonNull(courseType),
      args: {
        input: {
          type: updateCourseInputType,
        },
      },
      resolve(_, { input }, { db }) {
        const { id, ...rest } = input;
        const courses = db.courses;
        const index = courses.findIndex((course) => course.id == id);
        const updated = { ...courses[index], ...rest };
        courses[index] = updated;
        return updated;
      },
    },
    removeCourse: {
      type: new GraphQLNonNull(courseType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(_, { id }, { db }) {
        const index = db.courses.findIndex((c) => c.id == id);
        const removed = db.courses.splice(index, 1);
        return removed[0];
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: mutations,
});

module.exports = schema;
