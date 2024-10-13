import { createSlice } from "@reduxjs/toolkit";

export const userStateSlice = createSlice({
    name: 'userState',
    initialState: { isLogin: false, loginuser : {} }, // Initial state is an object with isLogin
    reducers: {
        checkingLogin: (state, action) => {
            state.isLogin = action.payload; // Update isLogin value
        },
        loginUser : (state,action) => {
            state.loginuser = action.payload
        }
    }
})

// Export the action
export const { checkingLogin, loginUser } = userStateSlice.actions;

// Correct export statement here
export default userStateSlice.reducer;
