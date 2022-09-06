import { Link } from 'react-router-dom';

const Jumbotron = () => {
  return (
    <div className="md:px-24 px-10 flex lg:flex-row flex-col-reverse md:mt-7 mt-5 items-center gap-16">
      <div className="flex-1">
        <h1 className="text-4xl font-medium text-gray-800 leading-relaxed">
          Ready to get started?{' '}
          <span className="text-gray-700">Join thousands of</span>
          <span className="text-green-500"> others today.</span>
        </h1>
        <p className="mt-4 leading-loose">
          <span className="text-gray-700 font-semibold">
            We have your back.
          </span>
          <span className="text-green-500 font-medium">
            {' '}
            With one-quarter of our global team{' '}
          </span>
          dedicated to trust and safety, we’ve successfully managed fundraisers
          worldwide for more than a decade. Don’t worry about a thing, we’ve got
          you covered.
        </p>
        <Link
          to="/campaigns"
          className="rounded-md bg-green-500 outline-0 hover:bg-green-600 transition-[background] text-white px-6 py-3 text-sm block mt-7 w-fit"
        >
          All Campaigns
        </Link>
      </div>
      <div className="flex-1">
        <img
          src={`${process.env.PUBLIC_URL}/images/auth.jpg`}
          alt="Let'sFundMe"
        />
      </div>
    </div>
  );
};

export default Jumbotron;
