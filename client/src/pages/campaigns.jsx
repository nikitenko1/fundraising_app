import { useState, useEffect, useRef } from 'react';
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai';
import { getDataAPI } from './../utils/fetchData';
import Navbar from '../components/global/Navbar';
import Footer from '../components/global/Footer';
import Pagination from '../components/global/Pagination';
import CampaignCard from '../components/global/CampaignCard';
import HeadInfo from '../utils/HeadInfo';

const Campaigns = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedType, setSelectedType] = useState({
    id: '',
    name: '',
  });
  const [openType, setOpenType] = useState(false);
  const [campaignTypes, setCampaignTypes] = useState([]);

  const typeRef = useRef();

  const handleClickType = (type, title) => {
    setSelectedType({ id: type, name: title });
    setOpenType(false);
  };

  useEffect(() => {
    (async () => {
      const res = await getDataAPI('type');
      setCampaignTypes(res.data.types);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getDataAPI(
        `campaign?page=${page}&limit=6&type_id=${selectedType.id}&search=${search}`
      );
      setCampaigns(res.data.campaigns);
      setTotalPage(res.data.total_page);
    })();
  }, [page, selectedType, search]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (openType && typeRef.current && !typeRef.current.contains(e.target)) {
        setOpenType(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () =>
      document.removeEventListener('mousedown', checkIfClickedOutside);
  }, [openType]);
  return (
    <>
      <HeadInfo title="Campaigns" />
      <Navbar />
      <div className="bg-slate-400 text-white rounded-md w-fit px-5 py-3 m-auto">
        <p>
          {selectedType.id} - {selectedType.name}
        </p>
      </div>
      <div className="mb-20">
        <div className="md:px-24 px-10 mt-24">
          <div className="relative">
            <div className="bg-green-400 h-24 px-20" />
            <form className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full md:max-w-[650px] max-w-[350px] flex items-center bg-white shadow-xl border border-gray-300 rounded-md px-4 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <AiOutlineSearch className="text-lg text-gray-500 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-sm  h-14 outline-0"
                  placeholder="Search campaign keyword ..."
                />
              </div>
              <p className="text-2xl text-gray-200">|</p>
              <div ref={typeRef} className="relative">
                <div
                  onClick={() => setOpenType(!openType)}
                  className="flex items-center gap-3 text-gray-700 cursor-pointer"
                >
                  <p className="text-sm capitalize">
                    {selectedType.id === 0 ? 'all type' : selectedType.name}
                  </p>
                  <AiFillCaretDown />
                </div>
                <div
                  className={`z-[99] absolute top-full max-h-[400px] w-[150px] hide-scrollbar overflow-auto mt-5 right-0 bg-white shadow-xl border boder-gray-300 text-sm rounded-md ${
                    openType ? 'scale-y-1' : 'scale-y-0'
                  } transition-[transform] origin-top`}
                >
                  <p
                    onClick={() => handleClickType('', '')}
                    className="cursor-pointer border-b border-gray-300 pl-3 py-3 pr-7 hover:bg-gray-100"
                  >
                    All Type
                  </p>
                  {campaignTypes.map((item) => (
                    <p
                      key={item._id}
                      onClick={() => handleClickType(item._id, item.title)}
                      className="cursor-pointer border-b border-gray-300 pl-3 py-3 pr-7 hover:bg-gray-100"
                    >
                      {item.title}
                    </p>
                  ))}
                </div>
              </div>
            </form>
          </div>
          <div className="md:px-24 px-10 mt-24">
            {campaigns.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-14 mt-14">
                {campaigns.map((item) => (
                  <CampaignCard
                    key={item._id}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    progress={
                      (item.collected_amount / item.target_amount) * 100
                    }
                    slug={item.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-red-500 text-white rounded-md w-fit px-5 py-3 m-auto">
                <p>There&apos;s no campaign data found.</p>
              </div>
            )}
          </div>
        </div>
        {totalPage > 1 && (
          <Pagination
            totalPage={totalPage}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Campaigns;
