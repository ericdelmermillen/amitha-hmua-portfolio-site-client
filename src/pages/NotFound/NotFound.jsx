import { useEffect } from 'react';
import { scrollToTop } from '../../utils/utils';
import './NotFound.scss';

const NotFound = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <div className="notFound">
        <h1 className="notFound__h1">
          Error 404
        </h1>
        <h2 className="notFound__h2">
          Nothing beautiful to see here...
        </h2>
      </div>
    </>
  )};

export default NotFound;