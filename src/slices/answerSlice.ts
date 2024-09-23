import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnswerState {
  results: { [key: string]: string }; // Мапа для ответов, где ключ — это имя вопроса
  currentQuestionIndex: number;
}

const initialState: AnswerState = {
  results: {}, // Массив заменен на объект
  currentQuestionIndex: 0,
};

export const answerSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{ name: string; answer: string }>
    ) => {
      // Сохраняем ответ в виде ключ-значение, где ключ — имя вопроса
      state.results[action.payload.name] = action.payload.answer;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
  },
});

export const { setAnswer, nextQuestion, previousQuestion } =
  answerSlice.actions;
export default answerSlice.reducer;
