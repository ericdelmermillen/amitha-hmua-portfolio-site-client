import { useEffect } from 'react';
import { scrollToTop } from '../../utils/utils';
import './NotFound.scss';

// initial load useEffect
const NotFound = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <div className="notFound">
        <h1 className="notFound__heading">
          Error 404
        </h1>
        <h2 className="notFound__sub-heading">
          Nothing beautiful to see here...
        </h2>
      </div>
    </>
  )};

export default NotFound;