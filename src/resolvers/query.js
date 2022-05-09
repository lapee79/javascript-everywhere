module.exports = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find();
    },

    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id);
    },

    noteFeed: async (parent, { cursor }, { models }) => {
        // limit를 10으로 hardcoding
        const limit = 10;
        // hasNextPage default를 false로 설정
        let hasNextPage = false;
        // 전달된 cursor가 없으면 기본 query는 빈 array를 할당
        // 이를 통해 DB에서 최신 Note index를 당겨오게 됨
        let cursorQuery = {};

        // cursor가 있으면 
        // query가 cursor 미만의 ObjectId를 가진 노트를 탐색
        if (cursor) {
            cursorQuery = { _id: {$lt: cursor} };
        }

        // DB에서 limit + 1개의 Note를 탐색하고 최신순으로 정렬
        let notes = await models.Note.find(cursorQuery)
            .sort({ _id: -1 })
            .limit(limit+1);

        // Note 개수가 limit를 초과하면 
        // hasNextPage를 true로 설정하고 notes를 limit까지 자름
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }

        // 새 cursor는 feed array 마지막 항목의 Mongo Object ID
        const newCursor = notes[notes.length - 1]._id;

        return {
            notes,
            cursor: newCursor,
            hasNextPage
        };
    },

    user: async (parent, { username }, { models }) => {
        // 주어진 username과 일치하는 사용자 찾기
        return await models.User.findOne({ username });
    },

    users: async (parent, args, { models }) => {
        // 모든 user 찾기
        return await models.User.find({});
    },

    me: async (parent, args, { models, user }) => {
        // 현재 user context에 맞는 사용자 찾기
        return await models.User.findById(user.id);
    },
};