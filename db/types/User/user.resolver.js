// const { f } = require('apollo-server-express')

module.exports = {
  Query: {
    async getUsers(_, __, { models }) {
      const users = await models.User.find().lean().exec();
      return users;
    },

    async getUser(_, { input }, { models: { User } }) {
      return User.findById(input.id).catch((e) => {
        console.warn(e);
      });
    },
  },
  Mutation: {
    async signUp(_, { input }, { models: { User } }) {
      const user = User.create(input);
      return user;
    },
    async signIn(_, { input }, { models: { User } }) {
      try {
        const user = User.authenticate(input);
        return user;
      } catch (error) {
        return null;
      }
    },
  },
  User: {
    id(p) {
      return p._id;
    },
    courses(u, _, { models }) {
      return models.Course.find({
        user: {
          $eq: u._id,
        },
      });
    },
  },
};
