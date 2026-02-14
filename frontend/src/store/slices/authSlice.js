import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/register`, user);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
});

export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.accessToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/users`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    users: [],
    usersLoading: false,
    isLoading: false,
    isError: false,
    message: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload.message;
                state.user = null;
            })
            .addCase(fetchAllUsers.pending, (state) => {
                state.usersLoading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
