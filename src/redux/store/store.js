import {configureStore} from "@reduxjs/toolkit";
import { MoviesReducer } from "../reducers/MoviesReducer";

export const store= configureStore({
    reducer:{
       MoviesReducer
    }
})