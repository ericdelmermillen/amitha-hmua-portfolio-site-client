import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NewShootDatePicker.scss';

const NewShootdatePicker = ({ newShootDate, setNewShootDate }) => {
  const handleChange = (date) => {
    setNewShootDate(date);
  };

  return (
    <DatePicker
      selected={newShootDate}
      onChange={handleChange}
      className='addShoot__date-picker'
      dateFormat="MM/dd/yyyy"
      placeholderText={newShootDate ? "Select a date" : newShootDate}
    />
  )};

export default NewShootdatePicker;
