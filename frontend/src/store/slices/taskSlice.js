import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = createAsyncThunk('tasks/getAll', async (filters, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.accessToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(API_URL, { ...config, params: filters });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.accessToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, taskData, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        isLoading: false,
        isError: false,
        message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            });
    },
});

export default taskSlice.reducer;
