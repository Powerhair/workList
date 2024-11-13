import { NumberLiteralType } from "typescript";


export const questions = [
  {
    name: "nameOfProduct",
    question: "Введите название типографии",
    type: "input",
  },

  {
    name: "typeOfSystem",
    question: "Тип системы?",
    type: "choice",
    options: ["Камера-Код", "Камера-Область"],
  },
  {
    name: "validationStreams",
    question: "Количество ручьев валидации?",
    type: "input",
  },
  {
    name: "widthOfPrint",
    question: "Введите максимальную ширину полотна в мм",
    type: "input",
  }, 
  {
    name: "speed",
    question: "Введите скорость полотна в м/мин",
    type: "input",
  }, 

  {
    name: "widthCodeElement",
    question: "Количество модулей по ширине кода?",
    type: "input",
  },
  {
    name: "widthOfCode",
    question: "Введите ширину кода в мм",
    type: "input",
  },
  {
    name: "distanceBetweenPoint",
    question: "Введите расстояние между метками в мм",
    type: "input",
  },
  {
    name: "chooseCamera",
    question: "Выберите камеру:",
    type: "choice",
    options: [], 
  },

  {
    name: "typeOfLens",
    question: "Выберите объективы",
    type: "choice",
    options: [],
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
    question: "Необходимо наличие Энкодера?",
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
  {
    name: "controlLocation",
    question: "Где будет распологаться шкаф управления?",
    type: "choice",
    options: ["На стене", "На оборудовании заказчика", "На полу"]
  },
];


interface CameraParams {
  pixel: number;
  imageSize: string,
  resolutionLength: number;
  resolutionWidth: number;
  fps: number;
}

export const parametrasOfCameras: { [key: string]: CameraParams } = {
  "LANO-AH40-125GM": {
    pixel: 0.4,
    imageSize: "1/2.9",
    resolutionLength: 540,
    resolutionWidth: 720,
    fps: 125.2
  },
  // "LANO-AH200-60GM/GC": {
  //   pixel: 2,
  //   imageSize: "1/1.7",
  //   resolutionLength: 1240,
  //   resolutionWidth: 1624,
  //   fps: 60,
  // },
  "LANO-AH320-38GM/GC": {
    pixel: 3.2,
    imageSize: "1/1.8",
    resolutionLength: 1536,
    resolutionWidth: 2048,
    fps: 38.1
  },
  "LANO-AH500-24GM/GC": {
    pixel: 5,
    imageSize: "2/3",
    resolutionLength: 2048,
    resolutionWidth: 2448,
    fps: 24.2
  },
  "LANO-AH890-13GM/GC": {
    pixel: 8.9,
    imageSize: "1",
    resolutionLength: 2160,
    resolutionWidth: 4096,
    fps: 13
  }
};

interface LensParams {
  pixel: number;
  focalLength: number;
  imageFormat: string;
  minDistance: number;
}

export const parametrasOfLens : { [key: string]: LensParams} = {
  "LANO-FA1220M18-5M": {
    pixel: 5,
    focalLength: 12,
    imageFormat: "1/1.8",
    minDistance: 10
  },
  "LANO-FA1620M18-5M": {
    pixel: 5,
    focalLength: 16,
    imageFormat: "1/1.8",
    minDistance: 10
  },
  "LANO-FA1228M23-8M": {
    pixel: 8,
    focalLength: 12,
    imageFormat: "1/1.8",
    minDistance: 10
  },
  "LANO-FA1628M23-8M": {
    pixel: 8,
    focalLength: 16,
    imageFormat: "1/1.8",
    minDistance: 10
  }
}