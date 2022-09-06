import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const createType = createAsyncThunk(
  'campaign_type/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    const state = thunkAPI.getState().campaign_type;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI(
        'type',
        { title: jobData.title },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      return {
        ...state,
        data: [res.data.type, ...state.data],
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const deleteType = createAsyncThunk(
  'campaign_type/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      await deleteDataAPI(`type/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Campaign type has been deleted successfully.',
        },
      });

      thunkAPI.dispatch({
        type: 'campaign_type/delete',
        payload: jobData.id,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const updateType = createAsyncThunk(
  'campaign_type/update',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(
        `type/${jobData.id}`,
        { title: jobData.title },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Succeded to update type.',
        },
      });

      thunkAPI.dispatch({
        type: 'campaign_type/update',
        payload: res.data.type,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const getType = createAsyncThunk(
  'campaign_type/get',
  async (page, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(`type?page=${page}&limit=10`);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });

      thunkAPI.dispatch({
        type: 'campaign_type/get',
        payload: { total_page: res.data.total_page, data: res.data.types },
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
  total_page: 0,
};

const typeSlice = createSlice({
  name: 'campaign_type',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    delete: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
    update: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('campaign_type/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default typeSlice.reducer;
