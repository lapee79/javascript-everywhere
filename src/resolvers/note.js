module.exports = {
    // 요청받으면 note의 author 정보를 resolve
    author: async (note, args, {models}) => {
        return await models.User.findById(note.author);
    },
    // 요청받으면 note의 favoritedBy 정보를 resolve
    favoritedBy: async (note, args, {models}) => {
        return await models.User.find({_id: {$in: note.favoritedBy}});
    }
};