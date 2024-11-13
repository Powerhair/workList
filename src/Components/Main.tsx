import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAnswer, nextQuestion, previousQuestion } from "../slices/answerSlice";
import Result from "./Result";
import QuestionInput from "./QuestionInput";
import TypeOfCameras from "./TypeOfCameras";
import TypeOfLens from "./TypeOfLens";
import { questions } from "../utils/data";
import { choiceOfCameras } from "../utils/choiceOfCameras";

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
  const [dynamicQuestions, setDynamicQuestions] = useState(questions);

  const currentQuestion = dynamicQuestions[currentQuestionIndex] || {
    name: "",
    question: "",
  };

  useEffect(() => {
    const { typeOfSystem } = results;

    if (typeOfSystem === "Камера-Область") {
      // Показываем все вопросы, кроме validationStreams
      const filteredQuestions = questions.filter(
        (q) => q.name !== "validationStreams"
      );
      setCameraOptions(choiceOfCameras(results))
      setDynamicQuestions(filteredQuestions);
    } else if (typeOfSystem === "Камера-Код") {
      // Показываем только validationStreams, исключая определённые вопросы
      const filteredQuestions = questions.filter(
        (q) =>
          ![
            "widthOfPrint",
            "speed",
            "widthCodeElement",
            "widthOfCode",
            "distanceBetweenPoint",
            "chooseCamera",
            "typeOfLens"
          ].includes(q.name)
         
      );
      dispatch(setAnswer({ name: "chooseCamera", answer: "LANO-AH40-125GM" }))
      dispatch(setAnswer({ name: "typeOfLens", answer: "LANO-FA1214M23-2M" }))

      setDynamicQuestions(filteredQuestions);
    } 



  }, [results.typeOfSystem, currentQuestionIndex, currentQuestion.name]);

  const handleNext = () => {
    if (selectedAnswer && currentQuestion.name) {
      dispatch(setAnswer({ name: currentQuestion.name, answer: selectedAnswer }));
      dispatch(nextQuestion());
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

  return currentQuestionIndex >= dynamicQuestions.length ? (
    <Result />
  ) : currentQuestion.name === "chooseCamera" ? (
    <TypeOfCameras
      currentQuestion={currentQuestion}
      cameraOptions={cameraOptions}
      setSelectedAnswer={setSelectedAnswer}
      selectedAnswer={selectedAnswer}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />
  ) : currentQuestion.name === "typeOfLens" ? (
    <TypeOfLens
      selectedCamera={results.chooseCamera}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      setSelectedAnswer={setSelectedAnswer}
      selectedAnswer={selectedAnswer}
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
