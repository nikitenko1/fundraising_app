import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { deleteDataAPI, getDataAPI, patchDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getFundraiser = createAsyncThunk(
  'fundraiser_verification/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await getDataAPI(
        `fundraiser?page=${jobData.page}&limit=10`,
        accessToken
      );

      thunkAPI.dispatch({ type: 'alert/alert', payload: {} });

      thunkAPI.dispatch({
        type: 'fundraiser_verification/get',
        payload: {
          data: res.data.fundraisers,
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

export const acceptFundraiser = createAsyncThunk(
  'fundraiser_verification/accept',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      await patchDataAPI(
        `fundraiser/status/${jobData.id}`,
        { is_active: true },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Succeded to change fundraiser status.',
        },
      });

      thunkAPI.dispatch({
        type: 'fundraiser_verification/accept',
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

export const rejectFundraiser = createAsyncThunk(
  'fundraiser_verification/reject',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await deleteDataAPI(`fundraiser/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      thunkAPI.dispatch({
        type: 'fundraiser_verification/reject',
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

const initialState = {
  data: [],
  total_page: 1,
};

const fundraiserVerificationSlice = createSlice({
  name: 'fundraiser_verification',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    reject: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
    accept: (state, action) => {
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
          action.type.startsWith('fundraiser_verification/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default fundraiserVerificationSlice.reducer;
