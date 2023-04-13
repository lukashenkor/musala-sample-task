import dayjs from 'dayjs';
import { NavLink } from 'react-router-dom';

function Device({
  _id,
  uid,
  vendor,
  dateCreated,
  status,
  gateway,
}) {
  
  return (
    <div className='list-item'>
      <NavLink to={`/devices/${_id}`}>
        <p>UID: {uid}</p>
        <p>Vendor: {vendor}</p>
        <p>Date created: {dayjs(dateCreated).format('DD.MM.YYYY HH:mm')}</p>
        <p>Status: {status ? '✅ Online' : ' ❌ Offline'}</p>
        {gateway && <p>Gateway: {gateway.name}</p>}
      </NavLink>
    </div>
  )
}

export default Device