import React from "react";

interface QuestionInputProps {
    currentQuestion: { name: string; question: string; type?: string; options?: string[];};
    selectedAnswer: string;
    setSelectedAnswer: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    handleNext: () => void;
    handlePrevious: () => void;
  }



  const QuestionInput: React.FC<QuestionInputProps> = ({
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    error,
    setError,
    handleNext,
    handlePrevious
  }) => {
    


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
            className={`block text-lg font-medium text-center py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer mb-4 ${
              selectedAnswer === option
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={() => setSelectedAnswer(option)}
              className="hidden" // Скрываем радио-инпут
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
      {currentQuestion.name === "widthOfPrint" || currentQuestion.name === "countOfPrintModule" ? (
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Начать заново
        </button>
      ) : (
        <button
          onClick={handlePrevious}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Назад
        </button>
      )}
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

}

export default QuestionInput