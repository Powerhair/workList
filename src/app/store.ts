import { configureStore } from "@reduxjs/toolkit";
import answerReducer from "../slices/answerSlice";

export const store = configureStore({
  reducer: {
    quiz: answerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
