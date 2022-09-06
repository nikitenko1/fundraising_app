import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { createWithdraw } from './../../redux/slice/fundraiserCampaignSlice';
import Loader from './../global/Loader';

const WithdrawModal = ({ openModal, setOpenModal, selectedItem }) => {
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state) => state);

  const [amount, setAmount] = useState(0);

  const modalRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide withdraw amount.',
        },
      });
    }

    if (amount > selectedItem.collectedAmount - selectedItem.amount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Invalid withdraw amount.',
        },
      });
    }

    dispatch(
      createWithdraw({
        amount: amount,
        campaign_id: selectedItem._id,
        token: `${auth.token}`,
      })
    );

    setOpenModal(false);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        openModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenModal(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  });

  return (
    <div
      className={`${
        openModal
          ? 'opacity-1 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } transition-all fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center z-[9999] md:px-0 px-5`}
    >
      <div
        ref={modalRef}
        className={`${
          openModal ? 'mt-0' : '-mt-20'
        } transition-all bg-white md:w-1/3 w-full rounded-md`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 p-5">
          <h1 className="text-lg font-medium">Withdraw</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="text-xl cursor-pointer"
          />
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="amount" className="text-sm">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3"
              />
            </div>
            <button
              type="submit"
              disabled={alert.loading ? true : false}
              className={`${
                alert.loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-default'
                  : 'bg-orange-400 hover:bg-orange-500 cursor-pointer'
              } transition-[background] text-white text-sm rounded-md w-24 h-10 float-right`}
            >
              {alert.loading ? <Loader /> : 'Withdraw'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
