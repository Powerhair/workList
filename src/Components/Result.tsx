import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

// Configure virtual file system of pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

    if (!tagSensor && !slotSensor) {
      setLengthCableFour(0); // Если оба false, длина кабеля = 0
    } else if (tagSensor !== slotSensor) {
      // Если один true, а другой false
      if (distanceOfSystem < 5) {
        setLengthCableFour(5);
      } else {
        setLengthCableFour(Math.ceil(distanceOfSystem / 5) * 5);
      }
    } else {
      // Если оба true
      if (distanceOfSystem < 5) {
        setLengthCableFour(10); // Учитываем два датчика
      } else {
        setLengthCableFour(Math.ceil((distanceOfSystem * 2) / 5) * 5); // Учитываем два датчика
      }
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

  const saveAsPDF = () => {
    const currentDate = new Date().toLocaleDateString(); // Получаем текущую дату в формате локали

    const docDefinition = {
      content: [
        {
          text: `${results.nameOfProduct}`,
          style: "header",
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        {
          style: "tablesContainer",
          table: {
            widths: ["*", 20, "*"], // Ширина колонок: первая таблица, вертикальная линия, вторая таблица
            body: [
              [
                {
                  // Первая таблица
                  table: {
                    widths: ["*", "*"],
                    body: [
                      [
                        { text: "Основная комплектация", style: "tableHeader" },
                        "",
                      ],
                      ["Количество камер:", cameras],
                      ["Тип камер", results.typeOfCameras],
                      ["Количество объективов:", cameras],
                      ["Тип объективов", results.typeOfLens],
                      ["Длина ламп", widthLed],
                      ["Количество ламп:", led],
                      ...(tagSensor ? [["Датчик метки", ""]] : []),
                      ...(slotSensor ? [["Щелевой датчик", ""]] : []),
                      ...(encoder ? [["Энкодер", "Крепление энкодера"]] : []),
                      ...(lightSignal ? [["Светозвуковая колонна", ""]] : []),
                      ["Монитор", ""],
                      ["Крепление монитора", ""],
                    ],
                  },
                  layout: "lightHorizontalLines",
                },
                { text: "" },
                {
                  // Вторая таблица
                  table: {
                    widths: ["*", "*"],
                    body: [
                      [{ text: "Расходники", style: "tableHeader" }, ""],
                      ["Четырехжильный кабель:", `${lengthCableFour} м`],
                      ...(lengthCableFive !== 0
                        ? [["Пятижильный кабель:", `${lengthCableFive} м`]]
                        : []),
                      ["Количество кареток:", `${slider} шт`],
                      ["Крепление для камер:", `${cameras} шт`],
                      ["Набор винтов для крепления камер:", `${cameras} шт`],
                      ["Набор винтов для крепления ламп:", `${led} шт`],
                      ["Набор винтов для крепления датчиков", ""],
                      ["Кабель питания ПК", ""],
                      ["Сигнальный кабель монитора", `${lengthCableFour} м`],
                      ["Удлинитель для USB: 1м", ""],
                      ["Мышь компьютерная", ""],
                    ],
                  },
                  layout: "lightHorizontalLines",
                },
              ],
            ],
          },
        },
        {
          text: `Дата: ${currentDate}`, // Текущая дата
          margin: [0, 20, 0, 0], // Отступы сверху, снизу
          alignment: "right", // Выравнивание по правому краю
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 5],
        },
        verticalLineStyle: {
          fontSize: 24,
          alignment: "center",
          margin: [0, 0, 0, 0], // Убираем отступы
        },
        tablesContainer: {
          margin: [0, 0, 0, 0], // Убираем отступы
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("results.pdf");
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

        <div className="text-center mt-6 flex flex-col md:flex-row justify-evenly">
          <button
            onClick={saveAsPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 mb-2 md:mb-0"
          >
            Сохранить PDF
          </button>
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
