const { GraphQLError } = require("graphql");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const jwt = require("jsonwebtoken");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

require("dotenv").config();

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (_root, args) => {
      const query = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        query.author = author._id;
      }

      if (args.genre) {
        query.genres = args.genre;
      }

      return Book.find(query).populate("author");
    },
    allAuthors: async () => Author.find({}),
    me: (_root, _args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (_root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let authorObject = await Author.findOne({ name: args.author });

      if (!authorObject) {
        authorObject = new Author({ name: args.author, bookCount: 1 });
      } else {
        authorObject.bookCount += 1;
      }

      try {
        await authorObject.save();
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          },
        });
      }

      const book = new Book({ ...args, author: authorObject });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (_root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      return author;
    },
    createUser: async (_root, args) => {
      const user = new User({ ...args });

      try {
        user.save();
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }

      return user;
    },
    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
