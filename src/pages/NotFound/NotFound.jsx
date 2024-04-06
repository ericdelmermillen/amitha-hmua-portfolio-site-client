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
          From Not Found
        </h1>
      </div>
    </>
  )};

export default NotFound;