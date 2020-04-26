const { ApolloServer, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');
const courses = require('./mock');

const typeDefs = gql`
  type Course {
    id: ID!
    title: String!
    views: Int
  }

  input getCoursesInput {
    page: Int
    limit: Int = 1
  }

  input getCourseInput {
    id: ID!
  }

  input createCourseInput {
    title: String!
  }

  input updateCourseInput {
    id: ID!
    title: String!
  }

  type Query {
    getCourses(input: getCoursesInput): [Course]
    getCourse(input: getCourseInput): Course
  }

  type Mutation {
    createCourse(input: createCourseInput): Course
    updateCourse(input: updateCourseInput): Course
    removeCourse(input: getCourseInput): Course
  }
`;

const queries = {
  getCourses(_, { input }, { db }) {
    const { limit, page } = input;
    if (page !== undefined) {
      return db.courses.slice(page * limit, (page + 1) * limit);
    }
    return db.courses;
  },
  getCourse(_, { input }, { db }) {
    return db.courses.find((course) => course.id === input.id);
  },
};

const mutations = {
  createCourse(_, { input }, ctx) {
    const newCourse = { ...input, id: Date.now(), views: 0 };
    ctx.db.courses.push(newCourse);
    return newCourse;
  },
  updateCourse(_, { input }, { db }) {
    const { id, ...rest } = input;
    const courses = db.courses;
    const index = courses.findIndex((course) => course.id == id);
    const updated = { ...courses[index], ...rest };
    courses[index] = updated;
    return updated;
  },
  removeCourse(_, { input: { id } }, { db }) {
    const index = db.courses.findIndex((c) => c.id == id);
    const removed = db.courses.splice(index, 1);
    return removed[0];
  },
};

const resolvers = {
  Query: queries,
  Mutation: mutations,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: {
    db: {
      courses,
    },
  },
});

server.listen(3000, function name(params) {
  console.log('Running');
});
