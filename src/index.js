const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

// import local modules
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// .env file에 명시된 port 또는 port 4000에서 server를 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

// DB에 연결
db.connect(DB_HOST);

// Apollo server 설정
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        // context에 db models 추가
        return { models };
    }
});

// Apollo GraphQL middleware를 적용하고 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' });

app.listen({port}, () => 
    console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
);
