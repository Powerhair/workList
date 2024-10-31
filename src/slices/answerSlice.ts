// answerSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  currentQuestionIndex: number;
  results: any; 
}

const initialState: QuizState = {
  currentQuestionIndex: 0,
  results: {},
};

const answerSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setAnswer(state, action: PayloadAction<{ name: string; answer: string }>) {
      state.results[action.payload.name] = action.payload.answer;
    },
    setCameraType(state, action: PayloadAction<string>) {
      state.results.tyeOfCameras = action.payload; // Store the camera count here
    },
    nextQuestion(state) {
      state.currentQuestionIndex += 1;
    },
    previousQuestion(state) {
      state.currentQuestionIndex -= 1;
    },
  },
});

export const { setAnswer,setCameraType, nextQuestion, previousQuestion } = answerSlice.actions;

export default answerSlice.reducer;
