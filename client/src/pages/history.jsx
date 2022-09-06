import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getHistory } from './../redux/slice/historySlice';
import HistoryCard from './../components/history/HistoryCard';
import Footer from './../components/global/Footer';
import Navbar from './../components/global/Navbar';
import Pagination from './../components/global/Pagination';
import HeadInfo from '../utils/HeadInfo';

const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, history } = useSelector((state) => state);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      getHistory({
        page: page,
        token: `${auth.token}`,
      })
    );
  }, [dispatch, auth.token, page]);

  useEffect(() => {
    if (!auth.token) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <>
      <HeadInfo title="Donation History" />
      <Navbar />
      <div className="mb-20 mt-10">
        <h1 className="m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-green-400 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
          Donation History
        </h1>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 md:px-24 px-10 mt-20">
          {history.data.length > 0 ? (
            <>
              {history.data.map((item) => (
                <HistoryCard
                  key={item._id}
                  title={item.campaign.title}
                  image={item.campaign.image}
                  slug={item.campaign.slug}
                  amount={item.amount}
                  date={item.createdAt}
                />
              ))}
            </>
          ) : (
            <div className="bg-red-500 text-white w-fit m-auto p-3 rounded-md">
              <p>There&apos;s no donation found on current user</p>
            </div>
          )}
        </div>
        {history.total_page > 1 && (
          <Pagination
            totalPage={history.total_page}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default History;
