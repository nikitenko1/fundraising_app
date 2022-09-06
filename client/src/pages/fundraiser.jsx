import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeadInfo from '../utils/HeadInfo';
import Footer from './../components/global/Footer';
import Navbar from './../components/global/Navbar';
import { dateFormatter } from './../utils/helper';
import Pagination from './../components/global/Pagination';
import FundraiserDetailModal from './../components/modal/FundraiserDetailModal';
import {
  acceptFundraiser,
  getFundraiser,
  rejectFundraiser,
} from './../redux/slice/fundraiserVerificationSlice';

const Fundraiser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, fundraiser_verification } = useSelector((state) => state);

  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState();
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const handleClickDetail = (item) => {
    setSelectedItem(item);
    setOpenDetailModal(true);
  };

  useEffect(() => {
    dispatch(
      getFundraiser({
        page: page,
        token: `${auth.token}`,
      })
    );
  }, [dispatch, auth.token, page]);

  useEffect(() => {
    if (!auth.token || (auth.token && auth.user?.role !== 'admin')) {
      navigate('/');
    }
  }, [auth, navigate]);
  return (
    <>
      <HeadInfo title="Fundraisers" />
      <Navbar />
      <div className="mt-10 mb-20 md:px-24 px-10">
        <h1 className="m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-green-300 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
          Fundraisers Verification
        </h1>
        <div className="w-full overflow-x-auto mt-16">
          <table className="w-full">
            <thead>
              <tr className="bg-green-400 text-center font-semibold text-white">
                <td className="p-3">No</td>
                <td>Name</td>
                <td>Email</td>
                <td>Phone</td>
                <td>Registered At</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {fundraiser_verification.data.map((item, i) => (
                <tr key={item._id} className="text-center bg-slate-50">
                  <td className="p-3">{i + 1}</td>
                  <td>{item.user.name}</td>
                  <td>{item.user.email}</td>
                  <td>{item.phone}</td>
                  <td>{dateFormatter(item.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => handleClickDetail(item)}
                      className="bg-blue-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-blue-600 transition-[background]"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() =>
                        dispatch(
                          acceptFundraiser({
                            token: `${auth.token}`,
                            id: item._id,
                          })
                        )
                      }
                      className="bg-green-500 text-white text-sm rounded-md p-2 mr-3 hover:bg-green-600 transition-[background]"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        dispatch(
                          rejectFundraiser({
                            token: `${auth.token}`,
                            id: item._id,
                          })
                        )
                      }
                      className="bg-red-500 text-white text-sm rounded-md p-2 hover:bg-red-600 transition-[background]"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {fundraiser_verification.total_page > 1 && (
          <Pagination
            totalPage={fundraiser_verification.total_page}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>
      <Footer />
      <FundraiserDetailModal
        openModal={openDetailModal}
        setOpenModal={setOpenDetailModal}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default Fundraiser;
