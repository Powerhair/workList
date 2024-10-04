import React from "react";
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface CreatePdfProps {
  results: any;
  cameras: number;
  led: number;
  widthLed: number;
  lengthCableFour: number;
  lengthCableFive: number;
  lengthCableForSignal: number;
  slider: number;
  tagSensor: boolean;
  slotSensor: boolean;
  encoder: boolean;
  lightSignal: boolean;
  nameOfProduct: string;
  screwForSensors: number;
  controlCabinetLocation: string;
}

const CreatePdf: React.FC<CreatePdfProps> = (props) => {
  const {
    results,
    cameras,
    led,
    widthLed,
    lengthCableFour,
    lengthCableFive,
    lengthCableForSignal,
    slider,
    tagSensor,
    slotSensor,
    encoder,
    lightSignal,
    nameOfProduct,
    screwForSensors,
    controlCabinetLocation
  } = props;

  const createCheckbox = () => ({
    canvas: [{ type: "rect", x: 0, y: 0, w: 10, h: 10 }],
    width: 10,
  });

  const createHorizontalLine = () => ({
    canvas: [{ type: "line", x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 1 }],
    margin: [0, 20, 0, 0],
  });

  const createTableRow = (label: string, value: any, showCheckbox: boolean = true) => [
    {
      columns: [
        showCheckbox ? createCheckbox() : {},
        { text: label, margin: [2, 0, 0, 0] },
      ],
    },
    value,
  ];

  const createConditionalRow = (condition: boolean, label: string, value: any) =>
    condition ? [createTableRow(label, value)] : [];

  const saveAsPDF = () => {
    const currentDate = new Date().toLocaleDateString();

    const docDefinition = {
      content: [
        {
          text: `Объект: ${results.nameOfProduct}`,
          style: "header",
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        {
          style: "tablesContainer",
          table: {
            widths: ["*", "auto"],
            body: [
              [{ text: "Основная комплектация", style: "tableHeader" }, ""],
              createTableRow("Количество камер:", cameras),
              createTableRow("Тип камер:", results.typeOfCameras),
              createTableRow("Количество объективов:", cameras),
              createTableRow("Тип объективов:", results.typeOfLens),
              createTableRow("Длина ламп:", `${widthLed} мм`),
              createTableRow("Количество ламп:", led),
              ...createConditionalRow(tagSensor, "Датчик метки", ""),
              ...createConditionalRow(slotSensor, "Щелевой датчик", ""),
              ...createConditionalRow(encoder, "Энкодер, крепление энкодера", ""),
              ...createConditionalRow(lightSignal, "Светозвуковая колонна", ""),
              createTableRow("Монитор:", ""),
              createTableRow("Крепление монитора", ""),
              [{ text: "Расходники", style: "tableHeader" }, ""],
              createTableRow("Четырехжильный кабель:", `${lengthCableFour} м`),
              ...createConditionalRow(lengthCableFive !== 0, "Пятижильный кабель:", `${lengthCableFive} м`),
              createTableRow("Количество кареток:", `${slider} шт`),
              createTableRow("Крепление для камер:", `${cameras} шт`),
              createTableRow("Набор винтов для крепления камер:", `${cameras} шт`),
              createTableRow("Набор винтов для крепления ламп:", `${led} шт`),
              createTableRow("Набор винтов для крепления датчиков:", `${screwForSensors} шт`),
              createTableRow("Шарнирный соединитель 20х20:", `${led * 2} шт`),
              createTableRow("Кабель питания ПК", ""),
              createTableRow("Сигнальный кабель монитора:", `${lengthCableFour} м`),
              createTableRow("Удлинитель для USB:", "1м"),
              createTableRow("Мышь компьютерная", ""),
              createTableRow(controlCabinetLocation, ""),
            ],
          },
          layout: {
            hLineWidth: (i: number, node: any) => {
              if (i === node.table.body.length || i === 0 || i === 13) {
                return 2;
              }
              return 0.5;
            },
            hLineColor: (i: number, node: any) => {
              return i === node.table.body.length || i === 0 || i === 13 ? "black" : "gray";
            },
          },
        },
        {
          text: "ФИО сотрудника, собиравшего отправку:",
          margin: [0, 20, 0, 0],
          alignment: "left",
        },
        createHorizontalLine(),
        {
          text: `Дата: ${currentDate}`,
          margin: [0, 20, 0, 0],
          alignment: "right",
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
        tablesContainer: {
          margin: [0, 0, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${nameOfProduct}.pdf`);
  };

  return (
    <button
      onClick={saveAsPDF}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 mb-2"
    >
      Сохранить PDF
    </button>
  );
};

export default CreatePdf;
