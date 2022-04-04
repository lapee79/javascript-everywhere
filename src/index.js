const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// GraphQL schema language로 schema를 구성
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String!
        notes: [Note]!
        note(id: ID!): Note!
    }

    type Mutation {
        newNote(content: String!): Note!
    }
`;

// schema field를 위한 resolver function 제공
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        notes: async () => {
            return await models.Note.find();
        },
        note: async (parent, args) => {
            return await models.Note.findById(args.id);
        }
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: 'Adam Scott'
            });
        }
    }
};

const app = express();

// DB에 연결
db.connect(DB_HOST);

// Apollo server 설정
const server = new ApolloServer({ typeDefs, resolvers });

// Apollo GraphQL middleware를 적용하고 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' });

app.listen({port}, () => 
    console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
);
