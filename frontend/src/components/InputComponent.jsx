import { TextField } from '@mui/material';
import React, { useState } from 'react'

function InputComponent({
  handleChange,
  errorMessage,
  props
}) {
  const [value, setValue] = useState('');
  const [blurred, setBlurred] = useState(false);

  function textFieldOnChangeHandler(e) {
    setValue(e.target.value);
    handleChange(e);
  }

  return (
    <div className='input-field'>
      <TextField
        className="create-item-input"
        onBlur={() => setBlurred(true)}
        onChange={textFieldOnChangeHandler}
        error={blurred && !value}
        {...props}
      />
      {(blurred && !value) && <p>{errorMessage}</p>}
    </div>
  )
}

export default InputComponent