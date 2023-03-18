import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { createToken, createUser, getCurrentUser } from "api/auth";

const name = "auth";
const initialState = createInitialState();
const extraActions = createExtraActions();
const selectors = createSelectors();
const reducers = createReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

export const authReducer = slice.reducer;
export const authActions = { ...slice.actions, ...extraActions };
export { selectors as authSelectors };

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

function createReducers() {
  return {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  };
}

function extraReducers(builder) {
  builder
    .addCase(extraActions.login.fulfilled, (state, action) => {
      const response = action.payload;
      const data = response.data;
      if (!response.error) {
        localStorage.setItem("token", JSON.stringify(data));
        state.token = data;
      }
    })
    .addCase(extraActions.signup.fulfilled, (state, action) => {
      const response = action.payload;
      const data = response.data;
    })
    .addCase(extraActions.getMe.fulfilled, (state, action) => {
      const response = action.payload;
      const data = response.data;
      if (!response.error) {
        localStorage.setItem("user", JSON.stringify(data));
        state.user = data;
      }
    });
}

function createExtraActions() {
  return {
    login: login(),
    signup: signup(),
    getMe: getMe(),
  };

  function login() {
    return createAsyncThunk(`${name}/login`, async (data) => {
      const response = await createToken(data);
      return response;
    });
  }

  function signup() {
    return createAsyncThunk(`${name}/signup`, async (data) => {
      const response = await createUser(data);
      return response;
    });
  }

  function getMe() {
    return createAsyncThunk(`${name}/getMe`, async (data) => {
      const response = await getCurrentUser(data);
      return response;
    });
  }
}

function createSelectors() {
  const selectSelf = (state) => state;

  const selectUser = createSelector(selectSelf, (state) => state[name].token);

  const selectMe = createSelector(selectSelf, (state) => state[name].user);

  return {
    selectUser,
    selectMe,
  };
}
