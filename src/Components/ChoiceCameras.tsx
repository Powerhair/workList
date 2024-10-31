import React, { useState ,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  setAnswer,

} from "../slices/answerSlice";


export interface CameraType {
  cameraName: string;
  countOfCameras: number;
  needOfFps: number;
}


interface ChoiceCamerasProps {
  currentQuestion: { 
    name: string; 
    question: string; 
    type?: string; 
    options?: string[]; // Добавлено опциональное поле options
  };
  cameraOptions: CameraType[];
  selectedAnswer: string;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void;
  handlePrevious: () => void;
}

const ChoiceCameras: React.FC<ChoiceCamerasProps> = ({
  cameraOptions, setSelectedAnswer, selectedAnswer, currentQuestion, handleNext, handlePrevious
}) => {

  const results = useSelector((state: RootState) => state.quiz.results);

  const dispatch = useDispatch();

  const [cameraCount, setCameraCount] = useState(0)



  const renderCameraOptions = () => {
    return cameraOptions.map((camera, idx) => (
      <label key={idx} className="block mb-4 text-lg font-medium text-gray-700">
        <input
          type="radio"
          name="camera"
          value={camera.cameraName}
          checked={selectedAnswer === camera.cameraName}
          onChange={() => {
            setSelectedAnswer(camera.cameraName);
            setCameraCount(camera.countOfCameras);
          }}
          className="mr-3 h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        {camera.cameraName} (Количество камер: {camera.countOfCameras}, FPS:{" "}
        {camera.needOfFps})
      </label>
    ));
  };

  useEffect(() => {

    if ( results.typeOfSystem === "Камера-область") {
      dispatch(
        setAnswer({ name: "camerasCount", answer: String(cameraCount) })
      );
    }

  }, [cameraCount])

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
  return null;

}

export default ChoiceCameras



    


