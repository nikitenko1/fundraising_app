import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { currencyFormatter, dateFormatter } from './../../utils/helper';
import Footer from './../../components/global/Footer';
import Navbar from './../../components/global/Navbar';
import Pagination from '../../components/global/Pagination';
import HeadInfo from '../../utils/HeadInfo';
import DeleteModal from './../../components/modal/DeleteModal';
import CreateCampaignModal from './../../components/modal/CreateCampaignModal';
import DonationModal from './../../components/modal/DonationModal';
import WithdrawModal from './../../components/modal/WithdrawModal';
import {
  deleteCampaign,
  getFundraiserCampaigns,
} from './../../redux/slice/fundraiserCampaignSlice';

const FundraiserCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, fundraiser_campaign } = useSelector((state) => state);

  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openDonationModal, setOpenDonationModal] = useState(false);

  const handleClickCreate = () => {
    setSelectedItem(undefined);
    setOpenCreateModal(true);
  };

  const handleClickUpdate = (item) => {
    setSelectedItem(item);
    setOpenCreateModal(true);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleDeleteCampaign = () => {
    dispatch(deleteCampaign({ id: selectedItem?._id, token: `${auth.token}` }));
    setOpenDeleteModal(false);
  };

  const handleClickWithdraw = (item) => {
    setSelectedItem(item);
    setOpenWithdrawModal(true);
  };

  const handleClickDonation = (item) => {
    setSelectedItem(item);
    setOpenDonationModal(true);
  };

  useEffect(() => {
    if (auth.token) {
      dispatch(getFundraiserCampaigns({ page: page, token: `${auth.token}` }));
    }
  }, [dispatch, auth.token, page]);

  useEffect(() => {
    if (!auth.token || (auth.token && auth.user?.role !== 'fundraiser')) {
      navigate('/');
    }
  }, [auth, navigate]);
  return (
    <>
      <HeadInfo title="Fundraiser Campaigns" />
      <Navbar />
      <div className="mt-10 mb-20 md:px-24 px-10">
        <h1 className="m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-green-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
          Campaigns
        </h1>
        <button
          onClick={() => handleClickCreate()}
          className="bg-green-400 text-white text-sm rounded-md w-36 h-10 hover:bg-green-500 transition-[background] mt-14 float-right"
        >
          Add Campaign
        </button>
        <div className="clear-both" />
        {fundraiser_campaign.data.length > 0 ? (
          <div className="w-full overflow-x-auto mt-10">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-green-600 text-center font-semibold text-white">
                  <td className="p-3">No</td>
                  <td>Title</td>
                  <td>Type</td>
                  <td>Collected Amount</td>
                  <td>Target Amount</td>
                  <td>Withdrawn Amount</td>
                  <td>Created At</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {fundraiser_campaign.data.map((item, i) => (
                  <tr key={item._id} className="text-center bg-slate-50">
                    <td className="p-3">{i + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.type}</td>
                    <td>{currencyFormatter(item.collectedAmount)},00</td>
                    <td>{currencyFormatter(item.targetAmount)},00</td>
                    <td>{currencyFormatter(item.withdrawnAmount)},00</td>
                    <td>{dateFormatter(item.createdAt)}</td>

                    <td className="flex lg:flex-row flex-col lg:items-center gap-2 mt-5">
                      <button
                        onClick={() => handleClickDonation(item)}
                        className=" bg-blue-500  rounded-md mr-3  text-sm text-white px-2 py-1 hover:bg-blue-600 transition-[background]"
                      >
                        Donation
                      </button>
                      <button
                        onClick={() => handleClickWithdraw(item)}
                        className=" bg-green-500  rounded-md mr-3 text-sm text-white px-2 py-1 hover:bg-green-600 transition-[background]"
                      >
                        Withdraw
                      </button>
                      <button
                        onClick={() => handleClickUpdate(item)}
                        className=" bg-yellow-500  rounded-md mr-3 text-sm text-white px-2 py-1 hover:bg-yellow-600 transition-[background]"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleClickDelete(item)}
                        className=" bg-red-500  rounded-md mr-3 text-sm text-white px-2 py-1 hover:bg-red-600 transition-[background]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-red-500 text-white w-fit m-auto mt-16 p-5 rounded-md">
            <p>There&apos;s currently no campaign type data found.</p>
          </div>
        )}
        {fundraiser_campaign.total_page > 1 && (
          <Pagination
            totalPage={fundraiser_campaign.total_page}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>
      <Footer />
      <DeleteModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        handleDelete={handleDeleteCampaign}
      />
      <CreateCampaignModal
        openModal={openCreateModal}
        setOpenModal={setOpenCreateModal}
        selectedItem={selectedItem}
      />
      <WithdrawModal
        openModal={openWithdrawModal}
        setOpenModal={setOpenWithdrawModal}
        selectedItem={selectedItem}
      />
      <DonationModal
        openModal={openDonationModal}
        setOpenModal={setOpenDonationModal}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default FundraiserCampaign;
