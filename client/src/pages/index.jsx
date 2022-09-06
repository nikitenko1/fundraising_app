import Navbar from '../components/global/Navbar';
import Footer from '../components/global/Footer';
import Jumbotron from '../components/home/Jumbotron';
import LatestCampaigns from '../components/home/LatestCampaigns';
import HowWeWork from '../components/home/HowWeWork';
import HeadInfo from '../utils/HeadInfo';

const Home = () => {
  return (
    <>
      <HeadInfo title="Home" />
      <Navbar />
      <Jumbotron />
      <LatestCampaigns />
      <HowWeWork />
      <Footer />
    </>
  );
};

export default Home;
