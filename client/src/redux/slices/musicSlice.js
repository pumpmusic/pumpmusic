import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 异步action：生成音乐
export const generateMusic = createAsyncThunk(
  'music/generate',
  async (musicData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/music/generate', musicData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 异步action：获取用户的音乐历史
export const getUserMusicHistory = createAsyncThunk(
  'music/getUserHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/music/history');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 异步action：获取公共音乐库
export const getPublicLibrary = createAsyncThunk(
  'music/getPublicLibrary',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/music/library?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 异步action：获取单个音乐详情
export const getMusicDetails = createAsyncThunk(
  'music/getDetails',
  async (musicId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/music/${musicId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 初始状态
const initialState = {
  currentMusic: null,
  userHistory: [],
  publicLibrary: [],
  totalPublicTracks: 0,
  currentPage: 1,
  loading: false,
  generating: false,
  error: null,
  message: null
};

// 创建slice
const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    clearCurrentMusic: (state) => {
      state.currentMusic = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 处理音乐生成
      .addCase(generateMusic.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateMusic.fulfilled, (state, action) => {
        state.generating = false;
        state.currentMusic = action.payload.music;
        state.userHistory = [action.payload.music, ...state.userHistory];
        state.message = 'Music generated successfully';
      })
      .addCase(generateMusic.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload?.message || 'Failed to generate music';
      })
      
      // 处理获取用户音乐历史
      .addCase(getUserMusicHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMusicHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.userHistory = action.payload;
      })
      .addCase(getUserMusicHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch music history';
      })
      
      // 处理获取公共音乐库
      .addCase(getPublicLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.publicLibrary = action.payload.tracks;
        state.totalPublicTracks = action.payload.total;
      })
      .addCase(getPublicLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch public library';
      })
      
      // 处理获取音乐详情
      .addCase(getMusicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMusicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMusic = action.payload;
      })
      .addCase(getMusicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch music details';
      });
  }
});

export const { clearCurrentMusic, setCurrentPage, clearError } = musicSlice.actions;
export default musicSlice.reducer;