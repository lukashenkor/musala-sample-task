import { isRejectedWithValue, isFulfilled } from '@reduxjs/toolkit';
import { setMessage } from '../features/requestStatus/request-status-slice';


export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    api.dispatch(
      setMessage({ message: action?.payload?.data?.message, status: "error" })
    );
  } else if (isFulfilled(action) && action.meta.arg.type !== "query") {
    api.dispatch(
      setMessage({ message: action?.payload?.message || null, status: "success" })
    );
  }
  return next(action)
}