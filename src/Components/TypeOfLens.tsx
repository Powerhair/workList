import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { setAnswer } from "../slices/answerSlice";

interface LensType {
  lensName: string;
  focalLength: number;
}

interface TypeOfLensProps {
  selectedCamera: string;
  handleNext: () => void;
  handlePrevious: () => void;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
  selectedAnswer: string;
}

// Зависимость камер и объективов
const cameraLensOptions: { [key: string]: string[] } = {
  "LANO-AH40-125GM": ["LANO-FA1214M23-2M"],
  "LANO-AH320-38GM/GC": ["LANO-FA1220M18-5M", "LANO-FA1620M18-5M"],
  "LANO-AH500-24GM/GC": ["LANO-FA1220M18-5M", "LANO-FA1620M18-5M"],
  "LANO-AH890-13GM/GC": ["LANO-FA1228M23-8M", "LANO-FA1628M23-8M"]
};

// Параметры объективов
const parametrasOfLens: { [key: string]: LensType } = {
  "LANO-FA1214M23-2M": { lensName: "LANO-FA1214M23-2M", focalLength: 12 },
  "LANO-FA1220M18-5M": { lensName: "LANO-FA1220M18-5M", focalLength: 12 },
  "LANO-FA1620M18-5M": { lensName: "LANO-FA1620M18-5M", focalLength: 16 },
  "LANO-FA1228M23-8M": { lensName: "LANO-FA1228M23-8M", focalLength: 12 },
  "LANO-FA1628M23-8M": { lensName: "LANO-FA1628M23-8M", focalLength: 16 }
};

const TypeOfLens: React.FC<TypeOfLensProps> = ({
  selectedCamera,
  handleNext,
  handlePrevious,
  setSelectedAnswer,
  selectedAnswer
}) => {
  const dispatch = useDispatch();
  const [availableLenses, setAvailableLenses] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCamera && cameraLensOptions[selectedCamera]) {
      setAvailableLenses(cameraLensOptions[selectedCamera]);
    }
  }, [selectedCamera]);

  const renderLensOptions = () => {
    return availableLenses.map((lens) => (
      <label
        key={lens}
        className={`block text-lg font-medium text-center py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer mb-4 ${
          selectedAnswer === lens
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        <input
          type="radio"
          name="lens"
          value={lens}
          checked={selectedAnswer === lens}
          onChange={() => setSelectedAnswer(lens)}
          className="hidden"
        />
        {parametrasOfLens[lens].lensName}, Фокусное расстояние: {parametrasOfLens[lens].focalLength} мм
      </label>
    ));
  };

  useEffect(() => {
    if (selectedAnswer) {
      dispatch(setAnswer({ name: "selectedLens", answer: selectedAnswer }));
    }
  }, [selectedAnswer, dispatch]);

  return (
    <div className="quiz-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Выберите объектив для камеры {selectedCamera}
        </h2>
        <div className="options mb-6">{renderLensOptions()}</div>

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
};

export default TypeOfLens;
