import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    alert: (_, action) => {
      return action.payload;
    },
  },
});

export default alertSlice.reducer;
