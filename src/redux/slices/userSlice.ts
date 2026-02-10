import { createSlice } from "@reduxjs/toolkit";

 const userSlice = createSlice({
    name : "userSlice",
    initialState : {
      token : "user token"
    },
    reducers : {}
 });

 export default userSlice.reducer