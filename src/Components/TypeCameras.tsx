import { parametrasOfCameras } from "../data";

export const choiceOfCameras = (results: any) => {
  console.log("Данные для расчета камер:", results); // Логируем входные данные
  const PPE: number = 6;
  const minElementOfCode: number = Number(results.widthOfCode) / Number(results.widthCodeElement);
  const pixelInMm: number = 1 / (minElementOfCode / PPE);
  const cameraResolutionInWidth: number = Number(results.widthOfPrint) * pixelInMm;

  const speedMmPerSecond: number = Math.ceil(Number(results.speed) * (1000 / 60));
  const fpsOnFullScreen: number = speedMmPerSecond / Number(results.distanceBetweenPoint);
  const distanceBetweenPointInPixel: number = Number(results.distanceBetweenPoint) * pixelInMm;
  const pixelOnWidthCode: number = PPE * Number(results.widthCodeElement);

  const resultsArray: Array<{ cameraName: string; countOfCameras: number; needOfFps: number }> = [];

  for (const cameraName in parametrasOfCameras) {
    if (parametrasOfCameras.hasOwnProperty(cameraName)) {
      const camera = parametrasOfCameras[cameraName];
      const countOfCameras: number = Math.ceil(cameraResolutionInWidth / camera.resolutionWidth);
      const countOfCodeInVertical: number = camera.resolutionLength / pixelOnWidthCode;
      const cropCadr: number = countOfCodeInVertical / 2;
      const cropFps: number = camera.fps * cropCadr;
      const needOfFps: number = fpsOnFullScreen / cropCadr;

      console.log(`Камера: ${cameraName}, Количество камер: ${countOfCameras}, Необходимый FPS: ${needOfFps}`); // Логируем результаты для каждой камеры

      if (countOfCameras <= 6 && camera.fps >= needOfFps) {
        resultsArray.push({
          cameraName,
          countOfCameras,
          needOfFps,
        });
      }
    }
  }

  console.log("Результаты по камерам:", resultsArray); // Логируем результаты
  return resultsArray;
};
