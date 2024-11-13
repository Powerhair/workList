import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setAnswer } from "../slices/answerSlice";

export interface CameraType {
  cameraName: string;
  countOfCameras: number;
  needOfFps: number;
}

interface TypeOfCamerasProps {
  currentQuestion: { 
    name: string; 
    question: string; 
    type?: string; 
    options?: string[]; 
  };
  cameraOptions: CameraType[];
  selectedAnswer: string;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void;
  handlePrevious: () => void;
}

const TypeOfCameras: React.FC<TypeOfCamerasProps> = ({
  cameraOptions,
  setSelectedAnswer,
  selectedAnswer,
  currentQuestion,
  handleNext,
  handlePrevious
}) => {

  const results = useSelector((state: RootState) => state.quiz.results);
  const dispatch = useDispatch();
  const [cameraCount, setCameraCount] = useState(0);

  const renderCameraOptions = () => {
    return cameraOptions.map((camera, idx) => (
      <label
        key={idx}
        className={`block text-lg font-medium text-center py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer mb-4 ${
          selectedAnswer === camera.cameraName
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        <input
          type="radio"
          name="camera"
          value={camera.cameraName}
          checked={selectedAnswer === camera.cameraName}
          onChange={() => {
            setSelectedAnswer(camera.cameraName);
            setCameraCount(camera.countOfCameras);
          }}
          className="hidden"
        />
        {camera.cameraName} (Количество камер: {camera.countOfCameras}, FPS: {camera.needOfFps})
      </label>
    ));
  };

  useEffect(() => {
    if (cameraCount) {
      dispatch(setAnswer({ name: "camerasCount", answer: String(cameraCount) }));
      
    }
  }, [cameraCount, dispatch]);

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
              disabled={!selectedAnswer}
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

  return null;
};

export default TypeOfCameras;
