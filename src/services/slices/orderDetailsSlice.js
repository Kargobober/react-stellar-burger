import { createSlice } from "@reduxjs/toolkit";
import { postOrder } from "../middlewares/orderDetailsQueries";


const initialState = {
  name: '',
  order: {
    number: 0,
  },
  success: undefined,
  isLoading: false,
  error: '',
  needDetails: false,
};

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    setNeedingDetails: (state, action) => {
      state.needDetails = action.payload;
    },
  },
  extraReducers: {
    [postOrder.pending.type]: (state) => {
      state.success = undefined;
      state.isLoading = true;
      state.error = 'нет ошибок';
    },
    [postOrder.fulfilled.type]: (state, action) => {
      state.name = action.payload.name;
      state.order.number = action.payload.order.number;
      state.success = action.payload.success;
      state.isLoading = false;
      state.error = 'нет ошибок';
    },
    [postOrder.rejected.type]: (state, action) => {
      state.success = false;
      state.isLoading = false;
      state.error = action.error.message;
    },
  }
});

export const { setNeedingDetails } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;