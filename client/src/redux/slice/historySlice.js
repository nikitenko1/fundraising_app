import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getHistory = createAsyncThunk(
  'history/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(
        `donation?page=${jobData.page}&limit=6`,
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });

      thunkAPI.dispatch({
        type: 'history/get',
        payload: {
          data: res.data.donations,
          total_page: res.data.total_page,
        },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

const initialState = {
  data: [],
  total_page: 1,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('history/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default historySlice.reducer;
