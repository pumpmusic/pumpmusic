import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 异步action：获取用户代币余额
export const getTokenBalance = createAsyncThunk(
  'tokens/getBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tokens/balance');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 异步action：购买代币
export const purchaseTokens = createAsyncThunk(
  'tokens/purchase',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/tokens/purchase', { amount });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 异步action：获取代币交易历史
export const getTokenTransactions = createAsyncThunk(
  'tokens/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/tokens/transactions');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 初始状态
const initialState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
  message: null
};

// 创建slice
const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    clearTokenError: (state) => {
      state.error = null;
      state.message = null;
    },
    // 当生成音乐成功后，更新代币余额
    updateBalanceAfterGeneration: (state, action) => {
      state.balance = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 处理获取代币余额
      .addCase(getTokenBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTokenBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.tokenBalance;
      })
      .addCase(getTokenBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch token balance';
      })
      
      // 处理购买代币
      .addCase(purchaseTokens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.tokenBalance;
        state.message = 'Tokens purchased successfully';
      })
      .addCase(purchaseTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to purchase tokens';
      })
      
      // 处理获取代币交易历史
      .addCase(getTokenTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTokenTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTokenTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch token transactions';
      });
  }
});

export const { clearTokenError, updateBalanceAfterGeneration } = tokenSlice.actions;
export default tokenSlice.reducer;