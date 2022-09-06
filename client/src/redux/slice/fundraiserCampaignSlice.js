import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import {
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
  postDataAPI,
} from './../../utils/fetchData';
import { uploadFile } from './../../utils/imageHelper';

export const getFundraiserCampaigns = createAsyncThunk(
  'fundraiser_campaign/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true,
        },
      });

      const res = await getDataAPI(
        `campaign/fundraiser?page=${jobData.page}&limit=10`,
        accessToken
      );

      thunkAPI.dispatch({
        type: 'fundraiser_campaign/get',
        payload: { total_page: res.data.total_page, data: res.data.campaigns },
      });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const createCampaign = createAsyncThunk(
  'fundraiser_campaign/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    const imageRes = await uploadFile([jobData.data.campaignImage], 'campaign');
    let imageUrl = imageRes[0];
    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true,
        },
      });

      const res = await postDataAPI(
        'campaign',
        { ...jobData.data, image: imageUrl },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      thunkAPI.dispatch({
        type: 'fundraiser_campaign/create',
        payload: { campaign: res.data.campaign, type: res.data.type },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'fundraiser_campaign/update',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    const imageRes = await uploadFile([jobData.campaignImage], 'campaign');
    let imageUrl = imageRes[0];

    try {
      const res = await patchDataAPI(
        `campaign/${jobData.id}`,
        { ...jobData.data, image: imageUrl },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'fundraiser_campaign/update',
        payload: { campaign: res.data.campaign, type: res.data.type },
      });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
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

export const deleteCampaign = createAsyncThunk(
  'fundraiser_campaign/delete',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      const res = await deleteDataAPI(`campaign/${jobData.id}`, accessToken);
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      thunkAPI.dispatch({
        type: 'fundraiser_campaign/delete',
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

export const createWithdraw = createAsyncThunk(
  'fundraiser_campaign/withdraw',
  async (jobData, thunkAPI) => {
    const state = thunkAPI.getState().fundraiser_campaign;
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          loading: true,
        },
      });

      const res = await postDataAPI(
        `withdraw`,
        { amount: jobData.amount, campaign_id: jobData.campaign_id },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });

      return {
        ...state,
        data: state.data.map((item) =>
          item.id === jobData.id
            ? {
                ...item,
                withdrawnAmount:
                  Number(item.withdrawnAmount) + Number(jobData.amount),
              }
            : item
        ),
      };
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

const fundraiserCampaignSlice = createSlice({
  name: 'fundraiser_campaign',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    create: (state, action) => {
      return {
        ...state,
        data: [action.payload, ...state.data],
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
    delete: (state, action) => {
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('fundraiser_campaign/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default fundraiserCampaignSlice.reducer;
