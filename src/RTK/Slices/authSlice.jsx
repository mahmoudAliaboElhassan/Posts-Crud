import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../API/axios-global";

export const Signup = createAsyncThunk(
  "authSlice/Signup",
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const { data } = await authAPI.post("/users/", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const Login = createAsyncThunk(
  "authSlice/Login",
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const { data } = await authAPI.post("/token/login/", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ForgetPassword = createAsyncThunk(
  "authSlice/ForgetPassword",
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const { data } = await authAPI.post("/users/reset_password/", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "authSlice/resetPassword",
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const { data } = await authAPI.post(
        "users/reset_password_confirm/",
        userData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isLoggedIn: false,
  data: [],
  token: localStorage.getItem("token"),
  loading: false,
  message: null,
  error: null,
  username: localStorage.getItem("username"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOutUser: (state, action) => {
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(Signup.fulfilled, (state, action) => {
        state.isLoggedIn = false;
        state.loading = true;
        localStorage.setItem("username", action.payload.username);
        state.username = action.payload.username;
      })
      .addCase(Signup.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.isLoggedIn = false;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem("token", action.payload.auth_token);
        state.token = action.payload.auth_token;
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      })

      .addCase(ForgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(ForgetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(ForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
export const { logOutUser } = authSlice.actions;
