import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  setAnswer,
  nextQuestion,
  previousQuestion,
} from "../slices/answerSlice";
import Result from "./Result";
import { questions } from "../data";

const Main = () => {
  const dispatch = useDispatch();
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.quiz.currentQuestionIndex
  );
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [error, setError] = useState(""); // Для отображения ошибки

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedAnswer && currentQuestion.name) {
      // Проверяем, есть ли поле name
      dispatch(
        setAnswer({ name: currentQuestion.name, answer: selectedAnswer }) // Сохраняем ответ по имени вопроса
      );
      setSelectedAnswer("");
      setError(""); // Очистить ошибку при успешном переходе
      dispatch(nextQuestion());
    } else {
      setError("Невозможно сохранить ответ без имени вопроса.");
    }
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
    setSelectedAnswer(""); // Сбросить выбранный ответ, если это нужно
    setError(""); // Очистить ошибку при успешном переходе
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Если тип вопроса input и нужно ввести только цифры
    if (
      currentQuestion.name === "quantityOfCameras" ||
      currentQuestion.name === "widthOfPrint" ||
      currentQuestion.name === "distanceToSystem" ||
      currentQuestion.name === "distanceToLightSignal"
    ) {
      // Проверка на числа
      if (/^\d*$/.test(value)) {
        setSelectedAnswer(value);
        setError(""); // Сброс ошибки при правильном вводе
      } else {
        setError("Пожалуйста, введите только цифры"); // Сообщение об ошибке
      }
    } else {
      // Если ввод может быть произвольным
      setSelectedAnswer(value);
      setError(""); // Очищаем ошибку, так как это произвольный ввод
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext(); // Вызываем функцию handleNext при нажатии Enter
    }
  };

  // Показываем результат после последнего вопроса
  if (currentQuestionIndex >= questions.length) {
    return <Result />;
  }

  return (
    <div className="quiz-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {currentQuestion.question}
        </h2>

        <div className="options mb-6">
          {currentQuestion.type === "choice" && currentQuestion.options ? (
            currentQuestion.options.map((option, idx) => (
              <label
                key={idx}
                className="block mb-4 text-lg font-medium text-gray-700"
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  className="mr-3 h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {option}
              </label>
            ))
          ) : (
            <div>
              <input
                type="text"
                value={selectedAnswer}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} // Добавляем обработчик для клавиши Enter
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите ваш ответ"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
              {/* Ошибка */}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Назад
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
