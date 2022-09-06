import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDataAPI } from './../../utils/fetchData';
import CampaignCard from './../global/CampaignCard';

const LatestCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    (async () => {
      const res = await getDataAPI('campaign?page=1&limit=3', auth.token);
      setCampaigns(res.data.campaigns);
    })();
  }, [auth.token]);

  return (
    <div className="mt-20 md:px-24 px-10">
      <h1 className="m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-green-400 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
        Latest Campaigns
      </h1>
      <div className="mt-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
        {campaigns.map((item) => (
          <CampaignCard
            key={item._id}
            title={item.title}
            description={item.description}
            image={item.image}
            progress={(item.collected_amount / item.target_amount) * 100}
            slug={item.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCampaigns;
