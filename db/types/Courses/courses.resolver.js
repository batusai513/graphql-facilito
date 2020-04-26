module.exports = {
  Query: {
    getCourses(_, { input } = {}, { models }) {
      const { limit, page } = input || {};
      return models.Course.find()
        .limit(limit)
        .skip((limit + 1) * page)
        .lean()
        .exec();
    },
    getCourse(_, { input }, { models }) {
      return models.Course.findById(input.id).lean().exec();
    },
  },
  Mutation: {
    async createCourse(_, { input }, { models }) {
      const { userId, ...args } = input;
      console.warn(userId, input);
      const user = await models.User.findById(userId);
      const course = await models.Course.create({ ...args, user });
      user.courses.push(course);
      await user.save();
      return course;
    },
    updateCourse(_, { input }, { models }) {
      const { id, ...rest } = input;
      return models.Course.findByIdAndUpdate(id, rest);
    },
    removeCourse(_, { input: { id } }, { models }) {
      return models.Course.findByIdAndRemove(id).lean().exec();
    },
  },
  Course: {
    id(p) {
      return p._id;
    },
    async user(course, _, { models: { User } }) {
      console.warn(course);
      return User.findById(course.user);
    },
  },
};
