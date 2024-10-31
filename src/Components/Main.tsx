import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  setAnswer,
  nextQuestion,
  previousQuestion,
  // setCameraCount,
  setCameraType,
} from "../slices/answerSlice";
import Result from "./Result";
import QuestionInput from "./QuestionInput";
import ChoiceCameras from "./ChoiceCameras";
import { choiceOfCameras } from "../choiceOfCameras";
import { questions } from "../data";

interface CameraType {
  cameraName: string;
  countOfCameras: number;
  needOfFps: number;
}

const Main = () => {
  const dispatch = useDispatch();
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.quiz.currentQuestionIndex
  );
  const results = useSelector((state: RootState) => state.quiz.results);

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  
  const [error, setError] = useState<string>("");
  const [cameraOptions, setCameraOptions] = useState<CameraType[]>([]);

  // Добавляем новый массив для вопросов, чтобы обрабатывать пропуск вопросов
  const [dynamicQuestions, setDynamicQuestions] = useState(questions);

  // Получаем текущий вопрос из массива dynamicQuestions
  const currentQuestion = dynamicQuestions[currentQuestionIndex] || {
    name: "",
    question: "",
  };

  const calculateCameraOptions = (results: any) => {
    const cameraResults: CameraType[] = choiceOfCameras(results);
    setCameraOptions(cameraResults);
  };

   

  useEffect(() => {
    if (currentQuestion.name === "distanceBetweenPoint") {
      calculateCameraOptions(results);
    }
  }, [currentQuestionIndex, currentQuestion.name, results]);

  useEffect(() => {
    if (currentQuestion.name === "chooseCamera") {
      // Убедитесь, что все необходимые поля заполнены
      if (
        results.widthOfPrint &&
        results.widthCodeElement &&
        results.distanceBetweenPoint
      ) {
        calculateCameraOptions(results);
      }
    }
  }, [results, currentQuestion.name]);

  const handleNext = () => {
    if (selectedAnswer && currentQuestion.name) {
      // Сохраняем ответ
      dispatch(
        setAnswer({ name: currentQuestion.name, answer: selectedAnswer })
      );

      // Если это вопрос о выборе типа системы
      if (currentQuestion.name === "typeOfSystem") {
        if (selectedAnswer === "Камера-код") {
          dispatch(
            setAnswer({ name: "chooseCamera", answer: "LANO-AH40-125GM" })
          );

          // Добавляем вопросы для "Камера-код", включая количество печатных ручьев и другие
          setDynamicQuestions((prev) => [
            ...prev.slice(0, currentQuestionIndex + 1),
            {
              name: "countOfPrintModule",
              question: "Введите количество печатных ручьев",
              type: "input",
            },
            ...prev.slice(currentQuestionIndex + 5), // Пропускаем 1 вопрос после типа системы
          ]);

        } else if (selectedAnswer === "Камера-область") {
          // Убедимся, что вопросы идут в правильном порядке для "Камера-область"
          setDynamicQuestions((prev) => [
            ...prev.slice(0, currentQuestionIndex + 1),
            {
              name: "widthOfPrint",
              question: "Введите максимальную ширину полотна в мм",
              type: "input",
            }, // Сначала ширина полотна
            {
              name: "speed",
              question: "Введите скорость полотна в м/мин",
              type: "input",
            }, // Затем скорость полотна
            ...prev.slice(currentQuestionIndex + 1),
          ]);
        }
      }

      // Переходим к следующему вопросу
      setTimeout(() => {
        dispatch(nextQuestion());
      }, 0);

      setSelectedAnswer("");
      setError("");
    } else {
      setError("Невозможно сохранить ответ без имени вопроса.");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex !== 0) {
      dispatch(previousQuestion());
      setSelectedAnswer("");
      setError("");
    }
  };
  




  if (currentQuestionIndex >= dynamicQuestions.length) {
    return <Result />;
  }

  return currentQuestion.name === "chooseCamera" ? (
    <ChoiceCameras
      currentQuestion={currentQuestion}
      cameraOptions={cameraOptions}
      setSelectedAnswer={setSelectedAnswer}
      selectedAnswer={selectedAnswer}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />
  ) : (
    <QuestionInput
      currentQuestion={currentQuestion}
      selectedAnswer={selectedAnswer}
      setSelectedAnswer={setSelectedAnswer}
      error={error}
      setError={setError}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />
  );
};

export default Main;
