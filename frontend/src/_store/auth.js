import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { createToken, createUser, getCurrentUser } from "api/auth";

const name = "auth";
const initialState = createInitialState();
const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const response = action.payload;
        const data = response.data;
        if (!response.error) {
          localStorage.setItem("token", JSON.stringify(data));
          state.token = data;
        }
      })
      .addCase(signup.fulfilled, (state, action) => {
        const response = action.payload;
        const data = response.data;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        const response = action.payload;
        const data = response.data;
        if (!response.error) {
          localStorage.setItem("user", JSON.stringify(data));
          state.user = data;
        }
      });
  },
});

export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;

function createInitialState() {
  return {
    token:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("token"))
        : null,
    user:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null,
  };
}

const selectSelf = (state) => state;
export const selectAuthUser = createSelector(
  selectSelf,
  (state) => state[name].token
);

export const login = createAsyncThunk(`${name}/login`, async (data) => {
  const response = await createToken(data);
  return response;
});

export const signup = createAsyncThunk(`${name}/signup`, async (data) => {
  const response = await createUser(data);
  return response;
});

export const getMe = createAsyncThunk(`${name}/getMe`, async (data) => {
  const response = await getCurrentUser(data);
  return response;
});
