import {
    createSlice,
} from "@reduxjs/toolkit";
import user_item from "public/sample_data/user_item";

const profilesSlice = createSlice({
    name: "profile",
    initialState: user_item,
    reducers: {
        followed(state, action) {
            state.followers_count += state.is_followed ? -1 : +1;
            state.is_followed = !state.is_followed;
        },
    },
});

export default profilesSlice.reducer;

export const { followed: profileFollowed } = profilesSlice.actions;