import {
    createSlice,
    createSelector,
    createEntityAdapter,
} from "@reduxjs/toolkit";

const commentsAdapter = createEntityAdapter({
    selectId: (obj) => obj.uuid,
    sortComparer: (a, b) => a.created < b.created,
});

const commentsSlice = createSlice({
    name: "comments",
    initialState: commentsAdapter.getInitialState({}),
    reducers: {
        liked(state, action) {
            const uuid = action.payload;
            const obj = state.entities[uuid];
            obj.likes_count += obj.is_liked ? -1 : +1;
            obj.is_liked = !obj.is_liked;
        },
        userFollowed(state, action) {
            const uuid = action.payload;
            const obj = state.entities[uuid];
            obj.user.is_followed = !obj.user.is_followed;
        },
        addedOne: commentsAdapter.addOne,
        addedMany: commentsAdapter.addMany,
    },
});

export const commentsReducer = commentsSlice.reducer;

export const {
    liked: commentLiked,
    userFollowed: commentUserFollowed,
    addedOne: addedOneComment,
    addedMany: addedManyComments,
} = commentsSlice.actions;

export const { selectAll: selectComments, selectById: selectCommentByUuid } =
commentsAdapter.getSelectors((state) => state.comments);

const selectUuids = (entities) => entities.map((obj) => obj.uuid);

export const selectCommentUuids = createSelector(selectComments, selectUuids);

export const selectCommentsByRepliedTo = createSelector(
    [selectComments, (state, repliedTo) => repliedTo],
    (entities, repliedTo) =>
    entities.filter(
        (obj) =>
        obj.replied_to.uuid == repliedTo.uuid &&
        obj.replied_to.type == repliedTo.type
    )
);

export const selectCommentUuidsByRepliedTo = createSelector(
    selectCommentsByRepliedTo,
    selectUuids
);