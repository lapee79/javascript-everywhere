const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');

require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {
    newNote: async (parent, args, { models, user }) => {
        // context에 user가 없으면 인증 error 던지기
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a note');
        }

        return await models.Note.create({
            content: args.content,
            // author의 mongo ID 참조
            author: mongoose.Types.ObjectId(user.id)
        });
    },
    updateNote: async (parent, { content, id }, { models, user }) => {
        // user가 아니면 인증 에러 던지기
        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }

        // note 찾기
        const note = await models.Note.findById(id);
        // note 소유자와 현재 user가 불일치하면 접근 error 던지기
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to update the note");
        }

        // DB의 note를 update하고 update된 note를 반환
        return await models.Note.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    content
                },
            },
            {
                new: true
            }
        );
    },
    deleteNote: async (parent, { id }, { models, user }) => {
        // user가 아니면 인증 error 던지기
        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }

        // note 찾기
        const note = await models.Note.findById(id);
        // note owner와 현재 user가 불일치하면 접근 error 던지기
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the note");
        }

        try {
            // 문제가 없으면 note 삭제
            await note.remove();
            return true;
        } catch (err) {
            return false;
        }
    },
    signUp: async (parent, { username, email, password }, { models }) => {
        // email 주소 string 처리
        email = email.trim().toLowerCase();
        // password hashing
        const hashed = await bcrypt.hash(password, 10);
        // gravatar URL 생성
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });

            // JWT 생성 및 반환
            return jwt.sign({id: user._id}, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            // account 생성 중 문제가 발생하면 error 던지기
            throw new Error('Error creating account');
        }
    },
    signIn: async (parent, {username, email, password}, {models}) => {
        if (email) {
            // email address string 처리
            email = email.trim().toLowerCase();
        }

        const user = await models.User.findOne({
            $or: [{email}, {username}]
        });

        // user를 찾지 못하면 인증 error 던지기
        if (!user) {
            throw new AuthenticationError('Error signing in');
        }

        // password가 불일치하면 인증 error 던지기
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('Error signing in');
        }

        // JWT 생성 및 반환
        return jwt.sign({id: user._id}, process.env.JWT_SECRET);
    }
};