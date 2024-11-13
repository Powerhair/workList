import React from "react";

import {BotLink} from "../utils/config"
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

  function transliterate(text: string): string {
    const translitMap: { [key: string]: string } = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
        'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
        'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
        'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    return text.split('').map((char: string) => translitMap[char] || char)
               .join('')
               .replace(/\s+/g, '_') // Заменяем пробелы на подчеркивания
               .replace(/[^\w\-_.]/g, ''); // Удаляем недопустимые символы
  }


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
    const transliteratedName = transliterate(nameOfProduct);
    const fileName = `${nameOfProduct}_${currentDate}.pdf`;
    
    const pdfData = {
        fileName,
        fileData: {
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
        }
    };

    console.log(pdfData)
    fetch(`${BotLink}/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pdfData),
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(err => console.error('Ошибка при отправке данных на сервер:', err));
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
