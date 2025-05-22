import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchThemeColors = createAsyncThunk(
  "themeColor/fetchThemeColors",
  async (_, { rejectWithValue }) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";
      const response = await fetch(`${baseURL}/theme-color`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch theme colors");
      }
      const data = await response.json();
      return {
        mainColor: data.mainColor || "",
        backgroundColor: data.backgroundColor || "",
        textColor: data.textColor || "",
      };
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const initialState = {
  mainColor: "#EAB308",
  backgroundColor: "#333333",
  textColor: "#fff",
  loading: false,
  error: null,
};

const themeColorSlice = createSlice({
  name: "themeColor",
  initialState,
  reducers: {
    setMainColor: (state, action) => {
      state.mainColor = action.payload;
    },
    setBackgroundColor: (state, action) => {
      state.backgroundColor = action.payload;
    },
    setTextColor: (state, action) => {
      state.textColor = action.payload;
    },
    resetColors: (state) => {
      state.mainColor = "";
      state.backgroundColor = "";
      state.textColor = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemeColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemeColors.fulfilled, (state, action) => {
        state.loading = false;
        state.mainColor = action.payload.mainColor;
        state.backgroundColor = action.payload.backgroundColor;
        state.textColor = action.payload.textColor;
      })
      .addCase(fetchThemeColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setMainColor, setBackgroundColor, setTextColor, resetColors } = themeColorSlice.actions;
export default themeColorSlice.reducer;
