import jwt_decode from 'jwt-decode';
import { getDataAPI } from './fetchData';

export const checkTokenExp = async (token, thunkAPI) => {
  const decoded = jwt_decode(token);
  if (decoded.exp >= Date.now() / 1000) return;

  const res = await getDataAPI('auth/refresh_token');
  thunkAPI.dispatch({
    type: 'auth',
    payload: {
      user: res.data.user,
      token: res.data.accessToken,
    },
  });

  return res.data.accessToken;
};
