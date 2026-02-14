import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

export const getProjects = createAsyncThunk('projects/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.accessToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.accessToken;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(API_URL, projectData, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        isLoading: false,
        isError: false,
        message: ''
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects = action.payload;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;
