import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postDataAPI } from './../../utils/fetchData';
import HeadInfo from '../../utils/HeadInfo';

const Activate = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activateAccount = useCallback(async () => {
    try {
      const res = await postDataAPI('auth/activate', { token: id });
      await dispatch({
        type: 'alert/alert',
        payload: {
          success: res.data.msg,
        },
      });
      navigate('/');
    } catch (err) {
      dispatch({
        type: 'alert/alert',
        payload: {
          error: err.response.data.msg,
        },
      });
      navigate('/');
    }
  }, [dispatch, navigate, id]);
  useEffect(() => {
    activateAccount();
  }, [activateAccount]);

  return (
    <>
      <HeadInfo title="Account Activation" />
      <div></div>
    </>
  );
};

export default Activate;
