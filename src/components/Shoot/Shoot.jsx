import './Shoot.scss';

const Shoot = (
  { title,
    thumbnail_url,
    models, 
    photographers }) => {
  
  return (
    <>
      <div className="shoot">
        <img 
          className='shoot__img'
          src={thumbnail_url} alt={`Thumbnail for "${title}" shoot`} />
        <p className='shoot__models'>
          {models.length > 1 ? "Models" : "Model"}
        </p>
        <ul>
          {models.map((model, index) => (
            <li key={index}>{model}</li>
          ))}
        </ul>
        <p className='shoot__photographers'>
          {photographers.length > 1 ? "Photographers" : "Photographer"}
        </p>
        <ul>
          {photographers.map(photographer => (
            <li key={photographer}>{photographer}</li>
          ))}
        </ul>
      </div>
    </>
  )};

export default Shoot;