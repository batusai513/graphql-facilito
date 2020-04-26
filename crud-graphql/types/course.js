const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql');

const courseType = new GraphQLObjectType({
  name: 'Course',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    views: {
      type: GraphQLInt,
    },
  },
});

const coursesInputType = new GraphQLInputObjectType({
  name: 'CoursesInput',
  fields() {
    return {
      page: {
        type: GraphQLInt,
      },
      limit: {
        type: GraphQLInt,
        defaultValue: 1,
      },
    };
  },
});

const courseInputType = new GraphQLInputObjectType({
  name: 'CourseInput',
  fields() {
    return {
      id: {
        type: GraphQLString,
      },
    };
  },
});

const createCourseInputType = new GraphQLInputObjectType({
  name: 'CreateCourseInput',
  fields() {
    return {
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
    };
  },
});

const updateCourseInputType = new GraphQLInputObjectType({
  name: 'UpdateCourseInput',
  fields() {
    return {
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    };
  },
});

module.exports = {
  courseType,
  coursesInputType,
  courseInputType,
  createCourseInputType,
  updateCourseInputType,
};
