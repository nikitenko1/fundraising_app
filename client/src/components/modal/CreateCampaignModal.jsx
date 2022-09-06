import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { getDataAPI } from './../../utils/fetchData';
import {
  createCampaign,
  updateCampaign,
} from './../../redux/slice/fundraiserCampaignSlice';
import Loader from './../global/Loader';

const CreateCampaignModal = ({ openModal, setOpenModal, selectedItem }) => {
  const dispatch = useDispatch();
  const { alert, auth } = useSelector((state) => state);

  const [campaignTypes, setCampaignTypes] = useState([]);
  const [campaignData, setCampaignData] = useState({
    title: '',
    type: '',
    targetAmount: 0,
    description: '',
  });

  const [campaignImage, setCampaignImage] = useState();
  const modalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaignData({ ...campaignData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setCampaignImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignData.title) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign title.',
        },
      });
    }

    if (!campaignData.type) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign type.',
        },
      });
    }

    if (!campaignData.targetAmount) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign target amount.',
        },
      });
    }

    if (!campaignData.description) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign description.',
        },
      });
    }

    if (!campaignImage) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide campaign image.',
        },
      });
    }
    if (selectedItem) {
      dispatch(
        updateCampaign({
          data: { ...campaignData },
          campaignImage: campaignImage,
          id: selectedItem._id,
          token: `${auth.token}`,
        })
      );
    } else {
      dispatch(
        createCampaign({
          data: { ...campaignData },
          campaignImage: campaignImage,
          token: `${auth.token}`,
        })
      );
    }

    setOpenModal(false);
  };

  useEffect(() => {
    (async () => {
      const res = await getDataAPI('type');
      setCampaignTypes(res.data.types);
    })();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setCampaignData({
        title: selectedItem.title,
        type: selectedItem.type_id,
        targetAmount: selectedItem.targetAmount,
        description: selectedItem.description,
      });
      setCampaignImage(selectedItem.image);
    }

    return () => {
      setCampaignData({
        title: '',
        type: '',
        targetAmount: 0,
        description: '',
      });

      setCampaignImage();
    };
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
        } transition-all bg-white w-full max-w-[600px] rounded-md`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 p-5">
          <h1 className="text-lg font-medium">Create Campaign</h1>
          <AiOutlineClose
            onClick={() => setOpenModal(false)}
            className="text-xl cursor-pointer"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-5 max-h-[600px] hide-scrollbar overflow-auto"
        >
          <div className="mb-6">
            <label htmlFor="title" className="text-sm">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={campaignData.title}
              onChange={handleChange}
              className="w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="type" className="text-sm">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={campaignData.type}
              onChange={handleChange}
              className="w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3"
            >
              <option value="">- Choose Type -</option>
              {campaignTypes.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="targetAmount" className="text-sm">
              Target Amount
            </label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              value={campaignData.targetAmount}
              onChange={handleChange}
              className="w-full outline-0 h-12 rounded-md indent-2 border border-gray-300 text-sm mt-3"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="text-sm">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={campaignData.description}
              onChange={handleChange}
              className="w-full outline-0 h-32 rounded-md p-2 border border-gray-300 text-sm mt-3 resize-none"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="image" className="text-sm">
              Image
            </label>
            <div className="flex items-start gap-8 mt-3">
              <div className="flex-1 outline outline-3 outline-gray-300 h-24">
                {campaignImage && (
                  <img
                    src={
                      typeof campaignImage === 'string'
                        ? campaignImage
                        : URL.createObjectURL(campaignImage)
                    }
                    alt={campaignData.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <input
                onChange={handleChangeImage}
                type="file"
                className="flex-1 outline-0 rounded-md p-2 border border-gray-300 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={alert.loading ? true : false}
            className={`text-white text-sm ${
              alert.loading
                ? 'bg-gray-200 hover:bg-gray-200 cursor-default'
                : 'bg-green-500 hover:bg-green-600 cursor-pointer'
            } transition-[background] rounded-md w-24 float-right h-10`}
          >
            {alert.loading ? <Loader /> : 'Submit'}
          </button>
          <div className="clear-both" />
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
