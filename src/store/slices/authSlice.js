import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(action)
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    // clearUser: (state) => {
    //   state.isAuthenticated = false;
    //   state.user = null;
    //   state.token = null;
    //   state.isAdmin = false;
    // },
    clearUser: () => initialState,
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
