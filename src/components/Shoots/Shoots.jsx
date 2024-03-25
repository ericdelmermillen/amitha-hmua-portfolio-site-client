import { useState, useEffect } from 'react';
import './Shoots.scss';
import Shoot from '../Shoot/Shoot';

const Shoots = () => {
  const [ shootsData, setShootsData ] = useState([])

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  `${BASE_URL}/shoots/all`

  useEffect(() => {
    const fetchShoots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/shoots/all`);

        if(response.ok) {
          const data = await response.json()
          setShootsData(data);
        } else {
          console.error('Failed to fetch shoots:', response.statusText);
        }
        
      } catch(error) {
        console.log(`Error fetching shoots: ${error}`)
      }
    }
    fetchShoots()
  }, [])

  return (
    <>
      <div className="shoots">
        <div className="shoots__inner">
        {shootsData.map(shoot => (
          <Shoot 
            key={shoot.shoot_id} 
            title={shoot.shoot_title}
            thumbnail_url={shoot.thumbnail_url}
            models={shoot.models}
            photographers={shoot.photographers}
          /> 
          )
        )}
          
        </div>
      </div>
    </>
  )};

export default Shoots;