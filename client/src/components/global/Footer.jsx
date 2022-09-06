import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="md:px-24 px-10 bg-slate-50 py-10">
      <div className="text-center">
        <div className="outline-0 flex items-center gap-5 justify-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/handout.svg`}
            alt="Let'sFundMe"
            width={36}
          />
        </div>
      </div>
      <div className="flex items-center justify-center text-sm mt-12 gap-10">
        <Link to="/" className="outline-0">
          Home
        </Link>
        <Link to="/campaigns" className="outline-0">
          Campaigns
        </Link>
        <Link to="/login" className="outline-0">
          Sign In
        </Link>
        <Link to="/register" className="outline-0">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Footer;
