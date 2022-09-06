import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteType, getType } from './../redux/slice/typeSlice';
import { dateFormatter } from './../utils/helper';
import DeleteModal from './../components/modal/DeleteModal';
import CreateTypeModal from './../components/modal/CreateTypeModal';
import Navbar from '../components/global/Navbar';
import Footer from '../components/global/Footer';
import Pagination from './../components/global/Pagination';
import HeadInfo from '../utils/HeadInfo';

const CampaignType = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, campaign_type } = useSelector((state) => state);

  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState();
  const [openCreateTypeModal, setOpenCreateTypeModal] = useState(false);
  const [openDeleteTypeModal, setOpenDeleteTypeModal] = useState(false);

  const handleClickCreate = () => {
    setSelectedItem(undefined);
    setOpenCreateTypeModal(true);
  };

  const handleClickUpdate = (item) => {
    setSelectedItem(item);
    setOpenCreateTypeModal(true);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteTypeModal(true);
  };

  const handleDeleteType = () => {
    dispatch(deleteType({ id: selectedItem?._id, token: `${auth.token}` }));
    setOpenDeleteTypeModal(false);
    dispatch(getType(page));
  };

  useEffect(() => {
    dispatch(getType(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (!auth.token || (auth.token && auth.user?.role !== 'admin')) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <>
      <HeadInfo title="Campaign Types" />
      <Navbar />
      <div className="mt-10 mb-20 md:px-24 px-10">
        <h1 className="m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-green-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
          Campaign Types || Fundraising categories
        </h1>
        <button
          onClick={() => handleClickCreate()}
          className="bg-green-400 text-white text-sm rounded-md w-24 h-10 hover:bg-green-500 transition-[background] mt-14 float-right"
        >
          Add Type
        </button>
        <div className="clear-both" />
        {campaign_type.data.length > 0 ? (
          <div className="w-full overflow-x-auto mt-10">
            <table className="w-full">
              <thead>
                <tr className="bg-green-400 text-center font-semibold text-white">
                  <td className="p-3">No</td>
                  <td>Type</td>
                  <td>Created At</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {campaign_type.data.map((item, i) => (
                  <tr key={item.id} className="text-center bg-slate-50">
                    <td className="p-3">{i + 1}</td>
                    <td>{item.title}</td>
                    <td>{dateFormatter(item.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleClickUpdate(item)}
                        className="bg-yellow-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-yellow-600 transition-[background]"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleClickDelete(item)}
                        className="bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]"
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
        {campaign_type.total_page > 1 && (
          <Pagination
            totalPage={campaign_type.total_page}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>
      <Footer />
      <CreateTypeModal
        openModal={openCreateTypeModal}
        setOpenModal={setOpenCreateTypeModal}
        selectedItem={selectedItem}
      />
      <DeleteModal
        openModal={openDeleteTypeModal}
        setOpenModal={setOpenDeleteTypeModal}
        handleDelete={handleDeleteType}
      />
    </>
  );
};

export default CampaignType;
