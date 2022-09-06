import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkTokenExp } from '../../utils/checkTokenExp';
import { getDataAPI, postDataAPI } from '../../utils/fetchData';

// You can only pass one argument to the thunk when you dispatch it.
// If you need to pass multiple values, pass them in a single object
export const getCampaignDetail = createAsyncThunk(
  'campaign_detail/get',
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const campaignRes = await getDataAPI(`campaign/${id}`);

      const campaign_id = campaignRes.data.campaign._id;
      const donationRes = await getDataAPI(
        `donation/${campaign_id}?page=1&limit=5`
      );

      const withdrawRes = await getDataAPI(
        `withdraw/${campaign_id}?page=1&limit=5`
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {},
      });

      thunkAPI.dispatch({
        type: 'campaign_detail/get',
        payload: {
          data: campaignRes.data.campaign,
          donations: donationRes.data.donations,
          withdraws: withdrawRes.data.withdraws,
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

export const createDonation = createAsyncThunk(
  'campaign_detail/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    const state = thunkAPI.getState().campaign_detail;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI(
        'donation',
        {
          ...jobData.donateData,
          amount: Number(jobData.donateData.amount),
          id: jobData.campaign_id,
        },
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: {
          success: 'Successfully donated to current campaign. Thank you :)',
        },
      });

      let newDonations = [
        {
          ...res.data.donation,
          name: jobData?.name,
          avatar: jobData?.avatar,
        },
        ...state.donations,
      ];
      if (newDonations.length > 5) {
        newDonations.pop();
      }

      thunkAPI.dispatch({
        type: 'campaign_detail/create',
        payload: {
          data: {
            ...state.data,
            collectedAmount:
              Number(state.data.collectedAmount) +
              Number(jobData.donateData.amount),
          },
          donations: { ...state.donations, newDonations },
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
  data: undefined,
  donations: [],
  withdraws: [],
};

const campaignDetailSlice = createSlice({
  name: 'campaign_detail',
  initialState,
  reducers: {
    get: (state, action) => {
      return {
        ...action.payload,
      };
    },
    create: (state, action) => {
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
          action.type.startsWith('campaign_detail/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default campaignDetailSlice.reducer;
