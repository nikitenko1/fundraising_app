import { Link } from 'react-router-dom';
import { currencyFormatter, dateFormatter } from './../../utils/helper';

const HistoryCard = ({ title, image, slug, amount, date }) => {
  return (
    <div className="rounded-md shadow-lg border border-gray-100 hover:scale-105 transition-[transform]">
      <div className="rounded-t-md w-full h-40 bg-gray-200">
        <img
          src={image}
          alt={title}
          className="w-full h-full rounded-t-md object-cover"
        />
      </div>
      <div className="p-5">
        <h1 className="font-medium text-xl">{title}</h1>
        <p className="mt-2">Amount: {currencyFormatter(amount)}</p>
        <p className="text-gray-500 mt-3">{dateFormatter(date)}</p>
        <Link
          to={`/campaign/${slug}`}
          className="float-right outline-0 bg-green-400 hover:bg-green-600 transition-[background] text-white text-sm  rounded-md px-4 py-2 block w-fit mt-5"
        >
          Detail
        </Link>
        <div className="clear-both" />
      </div>
    </div>
  );
};

export default HistoryCard;
