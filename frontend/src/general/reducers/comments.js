import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import comment_items from "../../../public/sample_data/comment_items";

const commentsAdapter = createEntityAdapter({
  selectId: (obj) => obj.uuid,
  sortComparer: (a, b) => a.created.localeCompare(b.created),
});

const commentsSlice = createSlice({
  name: "comments",
  initialState: commentsAdapter.addMany(
    commentsAdapter.getInitialState({}),
    comment_items
  ),
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
    added: commentsAdapter.addOne,
  },
});

export default commentsSlice.reducer;

export const { liked: commentLiked, userFollowed: commentUserFollowed, added: commentAdded } =
  commentsSlice.actions;

export const { selectAll: selectComments, selectById: selectCommentByUuid } =
  commentsAdapter.getSelectors((state) => state.comments);

export const selectCommentUuids = createSelector(selectComments, (entities) =>
  entities.map((obj) => obj.uuid)
);
