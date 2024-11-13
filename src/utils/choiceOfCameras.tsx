import {  parametrasOfCameras } from "./data";


export const choiceOfCameras = (results: any) => {
    const PPE: number = 6;
    const minElementOfCode: number =
      Number(results.widthOfCode) / Number(results.widthCodeElement);
    const pixelInMm: number = 1 / (minElementOfCode / PPE);
    const cameraResolutionInWidth: number =
      Number(results.widthOfPrint) * pixelInMm;
    const speedMmPerSecond: number = Math.ceil(
      Number(results.speed) * (1000 / 60)
    );
    const fpsOnFullScreen: number =
      speedMmPerSecond / Number(results.distanceBetweenPoint);
    const pixelOnWidthCode: number = PPE * Number(results.widthCodeElement);

    const tempResultsArray: Array<{
      cameraName: string;
      countOfCameras: number;
      needOfFps: number;
    }> = [];

    for (const cameraName in parametrasOfCameras) {
      if (parametrasOfCameras.hasOwnProperty(cameraName)) {
        const camera = parametrasOfCameras[cameraName];
        const countOfCameras: number = Math.ceil(
          cameraResolutionInWidth / camera.resolutionWidth
        );
        const countOfCodeInVertical: number =
          camera.resolutionLength / pixelOnWidthCode;
        const cropCadr: number = countOfCodeInVertical / 2;
        const needOfFps: number = Math.round(fpsOnFullScreen / cropCadr);

        if (countOfCameras <= 6 && camera.fps >= needOfFps) {
          tempResultsArray.push({
            cameraName,
            countOfCameras,
            needOfFps,
          });
        }
      }
    }

    return tempResultsArray;
  };