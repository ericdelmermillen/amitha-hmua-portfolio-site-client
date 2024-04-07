import DatePicker from 'react-datepicker';
import CalendarIcon from '../../assets/icons/CalendarIcon';
import 'react-datepicker/dist/react-datepicker.css';
import './NewShootDatePicker.scss';

const NewShootdatePicker = ({ newShootDate, setNewShootDate, className }) => {
  const handleChange = (date) => {
    setNewShootDate(date);
  };

  return (
    <>
    <div className="datePicker__container">

      <DatePicker
        selected={newShootDate}
        onChange={handleChange}
        className='datePicker__selector'
        dateFormat="MM/dd/yyyy"
        placeholderText={newShootDate ? "Select a date" : newShootDate}
      />
      <div className="datePicker__icon-container">
        <CalendarIcon 
          className={className}
        />
      </div>
      </div>
    </>
  )};

export default NewShootdatePicker;
