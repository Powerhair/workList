import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  setAnswer,
  nextQuestion,
  previousQuestion,
  setCameraCount,
  setCameraType,
} from "../slices/answerSlice";
import Result from "./Result";
import { questions, parametrasOfCameras } from "../data";

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
  const currentQuestion = dynamicQuestions[currentQuestionIndex] || { name: "", question: "" };

  const choiceOfCameras = (results: any) => {


    const PPE: number = 6;
    const minElementOfCode: number = Number(results.widthOfCode) / Number(results.widthCodeElement);
    const pixelInMm: number = 1 / (minElementOfCode / PPE);
    const cameraResolutionInWidth: number = Number(results.widthOfPrint) * pixelInMm;
    const speedMmPerSecond: number = Math.ceil(Number(results.speed) * (1000 / 60));
    const fpsOnFullScreen: number = speedMmPerSecond / Number(results.distanceBetweenPoint);
    const pixelOnWidthCode: number = PPE * Number(results.widthCodeElement);

    const tempResultsArray: Array<{ cameraName: string; countOfCameras: number; needOfFps: number }> = [];

    for (const cameraName in parametrasOfCameras) {
      if (parametrasOfCameras.hasOwnProperty(cameraName)) {
        const camera = parametrasOfCameras[cameraName];
        const countOfCameras: number = Math.ceil(cameraResolutionInWidth / camera.resolutionWidth);
        const countOfCodeInVertical: number = camera.resolutionLength / pixelOnWidthCode;
        const cropCadr: number = countOfCodeInVertical / 2;
        const needOfFps: number = Math.round(fpsOnFullScreen / cropCadr);
        console.log(camera.fps >= needOfFps); // Добавьте это для отладки

        if (countOfCameras <= 6 && camera.fps >= needOfFps) {
          tempResultsArray.push({
            cameraName,
            countOfCameras,
            needOfFps,
          });
        }
      }
    }

    return tempResultsArray;
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
      if (results.widthOfPrint && results.widthCodeElement && results.distanceBetweenPoint) {
        calculateCameraOptions(results);
      }
    }
  }, [results, currentQuestion.name]);

  const handleNext = () => {
    if (selectedAnswer && currentQuestion.name) {
      // Сохраняем ответ
      dispatch(setAnswer({ name: currentQuestion.name, answer: selectedAnswer }));
  
      // Если это вопрос о выборе типа системы
      if (currentQuestion.name === "typeOfSystem") {
        if (selectedAnswer === "Камера-код") {
          dispatch(setCameraType("LANO-AH40-125GM"));
  
          // Добавляем вопросы для "Камера-код", включая количество печатных ручьев и другие
          setDynamicQuestions(prev => [
            ...prev.slice(0, currentQuestionIndex + 1),
            { name: "countOfPrintModule", question: "Введите количество печатных ручьев", type: "input" },
            ...prev.slice(currentQuestionIndex + 5) // Пропускаем 1 вопрос после типа системы
          ]);
        } else if (selectedAnswer === "Камера-область") {
          // Убедимся, что вопросы идут в правильном порядке для "Камера-область"
          setDynamicQuestions(prev => [
            ...prev.slice(0, currentQuestionIndex + 1),
            { name: "widthOfPrint", question: "Введите максимальную ширину полотна в мм", type: "input" },  // Сначала ширина полотна
            { name: "speed", question: "Введите скорость полотна в м/мин", type: "input" }, // Затем скорость полотна
            ...prev.slice(currentQuestionIndex + 1)
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
    dispatch(previousQuestion());
    setSelectedAnswer("");
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (
      currentQuestion.name === "quantityOfCameras" ||
      currentQuestion.name === "widthOfPrint" ||
      currentQuestion.name === "distanceToSystem" ||
      currentQuestion.name === "distanceToLightSignal"
    ) {
      if (/^\d*$/.test(value)) {
        setSelectedAnswer(value);
        setError("");
      } else {
        setError("Пожалуйста, введите только цифры");
      }
    } else {
      setSelectedAnswer(value);
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const renderCameraOptions = () => {
    return cameraOptions.map((camera, idx) => (
      <label
        key={idx}
        className="block mb-4 text-lg font-medium text-gray-700"
      >
        <input
          type="radio"
          name="camera"
          value={camera.cameraName}
          checked={selectedAnswer === camera.cameraName}
          onChange={() => setSelectedAnswer(camera.cameraName)}
          className="mr-3 h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        {camera.cameraName} (Количество камер: {camera.countOfCameras}, FPS: {camera.needOfFps})
      </label>
    ));
  };

  if (currentQuestion.name === "chooseCamera") {
    if (cameraOptions.length > 0) {
      return (
        <div className="quiz-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              {currentQuestion.question}
            </h2>
            <div className="options mb-6">{renderCameraOptions()}</div>

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
    } else {
      return (
        <div className="quiz-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Вы ввели неверные данные
            </h2>
            <button
            onClick={handlePrevious}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Назад
          </button>
          </div>
          
        </div>
      );
    }
  }

  if (currentQuestionIndex >= dynamicQuestions.length) {
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
                onKeyDown={handleKeyDown}
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите ваш ответ"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
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
