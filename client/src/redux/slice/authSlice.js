import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, postDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/register', userData);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (jobData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/login', jobData.userData);
      localStorage.setItem('learnify_firstLogin', true);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      return {
        user: res.data.user,
        token: res.data.accessToken,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const firstLogin = localStorage.getItem('learnify_firstLogin');
      if (firstLogin !== 'true') return;

      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI('auth/refresh_token');

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      return {
        user: res.data.user,
        token: res.data.accessToken,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await getDataAPI('auth/logout', accessToken);
      localStorage.removeItem('learnify_firstLogin');

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.message,
        },
      });

      return {};
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.error,
        },
      });
    }
  }
);

const initialState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('auth/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default authSlice.reducer;
