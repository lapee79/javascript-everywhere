const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');

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
app.use(helmet());
app.use(cors());

// DB에 연결
db.connect(DB_HOST);

// JWT에서 user 정보 가져오기
const getUser = token => {
    if (token) {
        try {
            // token에서 얻은 user 정보 반환
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // token에 문제가 있으면 error 던지기
            throw new Error('Session invalid');
        }
    }
};

// Apollo server 설정
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        // header에서 user token 가져오기
        const token = req.headers.authorization;
        // token에서 user 얻기
        const user = getUser(token);
        // console에 logging
        console.log(user);
        // context에 db models 및 user 추가
        return {models, user};
    }
});

// Apollo GraphQL middleware를 적용하고 경로를 /api로 설정
server.applyMiddleware({ app, path: '/api' });

app.listen({port}, () => 
    console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
);
