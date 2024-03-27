import './PlaceholderShoot.scss';

const PlaceholderShoot = () => {
  return (
    <>
      <div className="placeholderShoot">
        <img className="placeholderShoot__img-skeleton" />
        <div className="placeholderShoot__info">
          <div className="placeholder__label--models"></div>
          <div className="placeholder__models"></div>
          <div className="placeholder__label--photographers"></div>
          <div className="placeholder__photographers"></div>
        </div>
      </div>
    </>
  )};

export default PlaceholderShoot;