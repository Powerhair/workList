import React from "react";
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

// Configure virtual file system of pdfMake
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
}

const CreatePdf: React.FC<CreatePdfProps> = ({
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
}) => {
  const createCheckbox = () => {
    return {
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: 10,
          h: 10,
        },
      ],
      width: 10, // ширина квадрата с небольшим отступом
    };
  };

  const saveAsPDF = () => {
    const currentDate = new Date().toLocaleDateString();

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
            widths: ["*", 20, "*"],
            body: [
              [
                {
                  table: {
                    widths: ["auto", "*"],
                    body: [
                      [
                        { text: "Основная комплектация", style: "tableHeader" },
                        "",
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Количество камер:", margin: [2, 0, 0, 0] },
                          ],
                        },
                        cameras,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Тип камер", margin: [2, 0, 0, 0] },
                          ],
                        },
                        results.typeOfCameras,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Количество объективов:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        cameras,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Тип объективов", margin: [2, 0, 0, 0] },
                          ],
                        },
                        results.typeOfLens,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Длина ламп", margin: [2, 0, 0, 0] },
                          ],
                        },
                        widthLed,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Количество ламп:", margin: [2, 0, 0, 0] },
                          ],
                        },
                        led,
                      ],
                      ...(tagSensor
                        ? [
                            [
                              {
                                columns: [
                                  createCheckbox(),
                                  {
                                    text: "Датчик метки",
                                    margin: [2, 0, 0, 0],
                                  },
                                ],
                              },
                              "",
                            ],
                          ]
                        : []),
                      ...(slotSensor
                        ? [
                            [
                              {
                                columns: [
                                  createCheckbox(),
                                  {
                                    text: "Щелевой датчик",
                                    margin: [2, 0, 0, 0],
                                  },
                                ],
                              },
                              "",
                            ],
                          ]
                        : []),
                      ...(encoder
                        ? [
                            [
                              {
                                columns: [
                                  createCheckbox(),
                                  { text: "Энкодер", margin: [2, 0, 0, 0] },
                                ],
                              },
                              "Крепление энкодера",
                            ],
                          ]
                        : []),
                      ...(lightSignal
                        ? [
                            [
                              {
                                columns: [
                                  createCheckbox(),
                                  {
                                    text: "Светозвуковая колонна",
                                    margin: [2, 0, 0, 0],
                                  },
                                ],
                              },
                              "",
                            ],
                          ]
                        : []),
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Монитор", margin: [2, 0, 0, 0] },
                          ],
                        },
                        "",
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Крепление монитора",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        "",
                      ],
                    ],
                  },
                  layout: "lightHorizontalLines",
                },
                { text: "" },
                {
                  table: {
                    widths: ["auto", "*"],
                    body: [
                      [{ text: "Расходники", style: "tableHeader" }, ""],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Четырехжильный кабель:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        `${lengthCableFour} м`,
                      ],
                      ...(lengthCableFive !== 0
                        ? [
                            [
                              {
                                columns: [
                                  createCheckbox(),
                                  {
                                    text: "Пятижильный кабель:",
                                    margin: [2, 0, 0, 0],
                                  },
                                ],
                              },
                              `${lengthCableFive} м`,
                            ],
                          ]
                        : []),
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Количество кареток:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        `${slider} шт`,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Крепление для камер:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        `${cameras} шт`,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Набор винтов для крепления камер:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        `${cameras} шт`,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Набор винтов для крепления ламп:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        `${led} шт`,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Набор винтов для крепления датчиков",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        "",
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Кабель питания ПК", margin: [2, 0, 0, 0] },
                          ],
                        },
                        "",
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Сигнальный кабель монитора:",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        `${lengthCableFour} м`,
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            {
                              text: "Удлинитель для USB: 1м",
                              margin: [2, 0, 0, 0],
                            },
                          ],
                        },
                        "",
                      ],
                      [
                        {
                          columns: [
                            createCheckbox(),
                            { text: "Мышь компьютерная", margin: [2, 0, 0, 0] },
                          ],
                        },
                        "",
                      ],
                    ],
                  },
                  layout: "lightHorizontalLines",
                },
              ],
            ],
          },
        },
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

    pdfMake.createPdf(docDefinition).download("results.pdf");
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
