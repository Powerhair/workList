export const questions = [
  {
    name: "nameOfProduct",
    question: "Введите название типографии",
    type: "input",
  },
  {
    name: "typeOfSystem",
    question: "Какой тип системы?",
    type: "choice",
    options: ["Камера-код", "Камера-область"],
  },
  {
    name: "quantityOfCameras",
    question: "Введите количество камер",
    type: "input",
  },
  {
    name: "typeOfCameras",
    question: "Ввыберите камеры",
    type: "choice",
    options: ["LANO-AH320-38GM", "LANO-AH500-24GM", "LANO-AH890-13GM"],
  },
  {
    name: "typeOfLens",
    question: "Ввыберите объективы",
    type: "choice",
    options: [
      "LANO-FA1220M18-5M",
      "LANO-FA1620M18-5M",
      "LANO-FA1224M23-5M",
      "LANO-FA1614M23-5M",
      "LANO-FA1224M18-10M",
      "LANO-FA1624M18-10M",
      "LANO-FA1220M11-12M",
      "LANO-FA1620M11-12M",
    ],
  },
  {
    name: "widthOfPrint",
    question: "Введите максимальнуюю ширину полотна в мм",
    type: "input",
  },

  {
    name: "distanceToSystem",
    question:
      "Введите расстояние от технического зрения до шкафа управления в метрах",
    type: "input",
  },
  {
    name: "tagSensor",
    question: "Необходимо наличие датчика метки?",
    type: "choice",
    options: ["Да", "Нет"],
  },
  {
    name: "slotSensor",
    question: "Необходимо наличие щелевого датчика?",
    type: "choice",
    options: ["Да", "Нет"],
  },
  {
    name: "encoder",
    question: "Необходимо наличие щелевого Энкодера?",
    type: "choice",
    options: ["Да", "Нет"],
  },
  {
    name: "lightSignal",
    question: "Необходимо наличие светозвуковой колонны?",
    type: "choice",
    options: ["Да", "Нет"],
  },
  {
    name: "distanceToLightSignal",
    question:
      "Введите расстояние от шкафа управления до светозвукоовой колонны в метрах. Если светозвуковая колонна устанавливается на шкаф укажите 0",
    type: "input",
  },
];
