import { Link, useLocation } from 'react-router-dom';

const NavbarLink = ({ path, text }) => {
  const { pathname } = useLocation();
  return (
    <Link
      to={path}
      className={`w-fit relative ${
        pathname === path &&
        'after:content-* after:w-2/3 after:h-[3px] after:bg-green-400 after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2'
      } hover:after:content-* hover:after:w-2/3 hover:after:h-[3px] hover:after:bg-green-400 hover:after:absolute hover:after:-bottom-2 hover:after:left-1/2 hover:after:-translate-x-1/2`}
    >
      {text}
    </Link>
  );
};

export default NavbarLink;
