import { Helmet } from 'react-helmet';

const HeadInfo = ({ title }) => {
  return (
    <Helmet>
      <title>Let'sFundMe || {title}</title>
    </Helmet>
  );
};

export default HeadInfo;
