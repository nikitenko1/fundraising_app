import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { createType, getType, updateType } from './../../redux/slice/typeSlice';
import Loader from './../global/Loader';

const CreateTypeModal = ({ openModal, setOpenModal, selectedItem }) => {
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const [title, setTitle] = useState('');

  const modalRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign type.',
        },
      });
    }

    if (selectedItem) {
      dispatch(
        updateType({
          id: selectedItem._id,
          title: title,
          token: `${auth.token}`,
        })
      );
    } else {
      dispatch(createType({ title: title, token: `${auth.token}` }));
    }
    setTitle('');
    setOpenModal(false);
  };

  useEffect(() => {
    if (selectedItem) {
      setTitle(selectedItem.title);
    }

    return () => setTitle('');
  }, [selectedItem]);

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
        } transition-all bg-white w-full max-w-[500px] rounded-md`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 p-5">
          <h1 className="text-lg font-medium">Create Campaign Type</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="text-xl cursor-pointer"
          />
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="text-sm">
                Type
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full indent-2 text-sm outline-0 border border-gray-300 rounded-md h-10 mt-3"
              />
            </div>
            <button
              type="submit"
              disabled={alert.loading ? true : false}
              className={`${
                alert.loading
                  ? 'bg-gray-200 hover:bg-gray-200 cursor-default'
                  : 'bg-green-400 hover:bg-green-500 cursor-pointer'
              } transition-[background] text-white text-sm rounded-md w-24 h-10 float-right`}
            >
              {alert.loading ? <Loader /> : 'Submit'}
            </button>
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTypeModal;
