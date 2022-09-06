import React from 'react';

const HowWeWork = () => {
  return (
    <div className="my-32 md:px-24 px-10">
      <h1 className="m-auto w-fit text-center text-2xl font-medium relative after:content-* after:w-2/3 after:h-[3px] after:bg-green-400 after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2">
        How <span className="text-gray-700 font-semibold">Let&apos;s</span>
        <span className="text-green-500 font-semibold">FundMe</span> Works?
      </h1>
      <div className="flex mt-20 items-center gap-32">
        <img src={`${process.env.PUBLIC_URL}/images/step.svg`} alt="WeCare" />
      </div>
      <div className="flex-1">
        <div className="flex items-center  gap-7 mb-16">
          <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shrink-0">
            <p>1</p>
          </div>
          <p className="leading-loose">
            <span className="text-green-500 font-semibold">
              Set your fundraiser goal.
            </span>{' '}
            Fundraiser create a campaign with spesific target amount to be
            collected
          </p>
        </div>
        <div className="flex items-center gap-7 mb-16">
          <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shrink-0">
            <p>2</p>
          </div>
          <p className="leading-loose">
            <span className="text-gray-700 font-semibold">Let&apos;s</span>
            <span className="text-green-500 font-semibold">FundMe</span> users
            can start donating to the newly created campaign.
          </p>
        </div>
        <div className="flex items-center gap-7 mb-16">
          <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shrink-0">
            <p>3</p>
          </div>
          <p className="leading-loose">
            Fundraiser can start withdrawing the collected amount from the
            campaign if urgently needed
          </p>
        </div>
        <div className="flex items-center gap-7">
          <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shrink-0">
            <p>4</p>
          </div>
          <p className="leading-loose">
            <span className="text-gray-700 font-semibold">Let&apos;s</span>
            <span className="text-green-500 font-semibold">FundMe</span>{' '}
            doesn&apos;t charge any amount of money either donating or
            withdrawing transaction occured
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowWeWork;
