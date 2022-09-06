import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import alertSlice from './slice/alertSlice';
import authSlice from './slice/authSlice';
import campaignDetailSlice from './slice/campaignDetailSlice';
import fundraiserCampaignSlice from './slice/fundraiserCampaignSlice';
import fundraiserVerificationSlice from './slice/fundraiserVerificationSlice';
import historySlice from './slice/historySlice';
import typeSlice from './slice/typeSlice';

const store = configureStore({
  reducer: {
    alert: alertSlice,
    auth: authSlice,
    campaign_detail: campaignDetailSlice,
    campaign_type: typeSlice,
    fundraiser_campaign: fundraiserCampaignSlice,
    fundraiser_verification: fundraiserVerificationSlice,
    history: historySlice,
  },
});

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
