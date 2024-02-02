import { createSlice } from '@reduxjs/toolkit';

const intialState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  intialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;
