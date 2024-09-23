import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const Result = () => {
  const results = useSelector((state: RootState) => state.quiz.results);

  const [led, setLed] = useState(0); // Для хранения количества ламп
  const [cameras, setCameras] = useState(0); // Для количества камер
  const [lengthCableFour, setLengthCableFour] = useState(0); // Длина четырехжильного кабеля
  const [lengthCableFive, setLengthCableFive] = useState(0); // Длина пятижильного кабеля
  const [lengthCableForSignal, setLengthCableForSignal] = useState(0); // Длина пятижильного кабеля
  const [widthLed, setWidthLed] = useState(100);
  const [slider, setSlider] = useState(1);

  const [tagSensor, setTagSensor] = useState(false); //
  const [slotSensor, setSlotSensor] = useState(false); //
  const [encoder, setEncoder] = useState(false); //
  const [lightSignal, setLightSignal] = useState(false); //

  const choiceOfSensors = () => {
    if (results.tagSensor === "Да") {
      // Примерная логика
      setTagSensor(true);
    } else {
      setTagSensor(false);
    }
    if (results.slotSensor === "Да") {
      // Примерная логика
      setSlotSensor(true);
    } else {
      setSlotSensor(false);
    }
    if (results.encoder === "Да") {
      // Примерная логика
      setEncoder(true);
    } else {
      setEncoder(false);
    }
    if (results.lightSignal === "Да") {
      // Примерная логика
      setLightSignal(true);
    } else {
      setLightSignal(false);
    }
  };

  const fourCableLengthCalculation = () => {
    // Логика для расчета длины четырехжильного кабеля
    const distanceOfSystem = Number(results.distanceToSystem);
    if (distanceOfSystem < 5) {
      setLengthCableFour(5);
    } else {
      setLengthCableFour(Math.ceil(distanceOfSystem / 5) * 5);
    }
  };

  const cableForSignal = () => {
    // Логика для расчета длины кабеля для колонны
    const distanceToLightSignal = Number(results.distanceToLightSignal);
    if (distanceToLightSignal === 0) {
      setLengthCableForSignal(0);
    } else if (distanceToLightSignal > 1 && distanceToLightSignal < 5) {
      setLengthCableForSignal(5);
    } else {
      setLengthCableForSignal(Math.ceil(distanceToLightSignal / 5) * 5);
    }
  };

  const fiveCableLengthCalculation = () => {
    cableForSignal();
    if (lengthCableForSignal !== 0 && encoder) {
      setLengthCableFive(lengthCableForSignal + lengthCableFour);
    } else if (lengthCableForSignal !== 0 && encoder === false) {
      setLengthCableFive(lengthCableForSignal);
    } else if (lengthCableForSignal === 0 && encoder) {
      setLengthCableFive(lengthCableFour);
    } else if (lengthCableForSignal === 0 && encoder === false) {
      setLengthCableFive(0);
    }
  };

  const ledCalculation = () => {
    // Логика для вычисления количества ламп
    if (results.typeOfSystem === "Камера-код") {
      setLed(cameras * 2);
    } else {
      setLed(2);
    }
  };

  const choiceWidthLed = () => {
    const widthOfPrint = Number(results.widthOfPrint);
    if (results.typeOfSystem === "Камера-код") {
      setWidthLed(100);
    } else {
      if (widthOfPrint <= 350) {
        setWidthLed(400);
      } else if (350 < widthOfPrint) {
        setWidthLed(600);
      }
    }
  };

  useEffect(() => {
    choiceOfSensors();
    setCameras(Number(results.quantityOfCameras));
    ledCalculation();
    fourCableLengthCalculation();
    fiveCableLengthCalculation();
    choiceWidthLed();
    setSlider(
      cameras +
        led +
        (tagSensor ? 1 : 0) +
        (slotSensor ? 1 : 0) +
        (encoder ? 1 : 0)
    );
  }, [results, cameras, led, tagSensor, slotSensor, encoder]); // Хук будет запускаться при изменении `results`

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-7 text-center text-gray-800">
          {results.nameOfProduct}
        </h2>

        {/* Контейнер для двух столбцов */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Основная комплектация */}
          <div className="w-full md:w-1/2 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-gray-500 mb-4 md:mb-0">
            <h3 className="text-3xl font-semibold mb-4 text-gray-900">
              Основная комплектация
            </h3>

            <div className="mb-6 text-lg">
              <p className="mb-2">
                <span className="font-semibold">Количество камер:</span>{" "}
                {cameras}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Тип камер:</span>{" "}
                {results.typeOfCameras}
              </p>

              <p className="mb-2">
                <span className="font-semibold">Количество объективов:</span>{" "}
                {cameras}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Тип объективов:</span>{" "}
                {results.typeOfLens}
              </p>

              <p className="mb-2">
                <span className="font-semibold">Количество ламп:</span> {led}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Длина ламп:</span> {widthLed} мм
              </p>
              {tagSensor && (
                <p className="mb-2">
                  <span className="font-semibold">Датчик метки</span>
                </p>
              )}
              {slotSensor && (
                <p className="mb-2">
                  <span className="font-semibold">Щелевой датчик</span>
                </p>
              )}
              {encoder && (
                <p className="mb-2">
                  <span className="font-semibold">Энкодер</span>
                </p>
              )}
              {encoder && (
                <p className="mb-2">
                  <span className="font-semibold">Крепление для энкодера</span>
                </p>
              )}
              {lightSignal && (
                <p className="mb-2">
                  <span className="font-semibold">Светозвуковая колонна</span>
                </p>
              )}
              <p className="mb-2">
                <span className="font-semibold">Монитор</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Крепление монитора</span>
              </p>
            </div>
          </div>

          {/* Расходники */}
          <div className="w-full md:w-1/2 pl-0 md:pl-4">
            <h3 className="text-3xl font-semibold mb-4 text-gray-900">
              Расходники
            </h3>

            <div className="mb-6 text-lg">
              <p className="mb-2">
                <span className="font-semibold">Четырехжильный кабель:</span>{" "}
                {lengthCableFour} м
              </p>
              {lengthCableFive !== 0 && (
                <p className="mb-2">
                  <span className="font-semibold">Пятижильный кабель:</span>{" "}
                  {lengthCableFive} м
                </p>
              )}
              <p className="mb-2">
                <span className="font-semibold">Количество кареток:</span>{" "}
                {slider} шт
              </p>
              <p className="mb-2">
                <span className="font-semibold">Крепление для камер:</span>{" "}
                {cameras} шт
              </p>
              <p className="mb-2">
                <span className="font-semibold">
                  Набор винтов для крепления камер:
                </span>{" "}
                {cameras} шт
              </p>
              <p className="mb-2">
                <span className="font-semibold">
                  Набор винтов для крепления ламп:
                </span>{" "}
                {led} шт
              </p>
              <p className="mb-2">
                <span className="font-semibold">
                  Набор винтов для крепления датчиков
                </span>
              </p>

              <p className="mb-2">
                <span className="font-semibold">Кабель питания ПК</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">
                  Сигнальный кабель монитора:
                </span>{" "}
                {lengthCableFour} м
              </p>
              <p className="mb-2">
                <span className="font-semibold">Удлинитель USB:</span> 1 м
              </p>
              <p className="mb-2">
                <span className="font-semibold">Мышь компьютерная</span>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Перезапустить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
