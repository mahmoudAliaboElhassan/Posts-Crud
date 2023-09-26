import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cruidAPI } from "../../API/axios-global";

const initialState = {
  records: [],
  loading: false,
  error: null,
  post: null,
  count: null,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ pageNo, type }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await cruidAPI.get(
        `/api/posts?post_type=${type}&page=${pageNo}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type":
              'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      await cruidAPI.delete(`/api/posts/${data.id}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type":
            'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPost = createAsyncThunk("posts/add", async (data, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const res = await cruidAPI.post("/api/posts", data, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return res;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await cruidAPI.get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type":
            'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await cruidAPI.patch(`/api/posts/${data.id}`, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type":
            'multipart/form-data; charset=utf-8; boundary="another cool boundary";',
        },
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(
          (el) => action.payload.id !== el.id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
