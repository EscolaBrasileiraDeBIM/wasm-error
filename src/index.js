import {IfcAPI} from "web-ifc/web-ifc-api";
const ifcFileLocation = "./IFC/01.ifc";
let modelID = 0;
const ifcapi = new IfcAPI();

import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xffffff),
});
viewer.axes.setAxes();
viewer.grid.setGrid();
viewer.IFC.setWasmPath("./");

async function loadIfc(url) {
  const model = await viewer.IFC.loadIfcUrl(url);
  await viewer.shadowDropper.renderShadow(model.modelID); 
  viewer.context.renderer.postProduction.active = true;
}

function getIfcFile(url) {
  return new Promise((resolve, reject) => {
    var oReq = new XMLHttpRequest();
    oReq.responseType = "arraybuffer";
    oReq.addEventListener("load", () => {
      resolve(new Uint8Array(oReq.response));
    });
    oReq.open("GET", url);
    oReq.send();
  });
}

ifcapi.Init().then(()=>{
  ifcapi.SetWasmPath("../../../../");
  getIfcFile(ifcFileLocation).then((ifcData) => {
    modelID = ifcapi.OpenModel(ifcData);
    let isModelOpened = ifcapi.IsModelOpen(modelID);
    console.log({isModelOpened});
    const lines = ifcapi.GetAllLines(modelID);
    console.log(lines);
    ifcapi.CloseModel(modelID);
  });
});

loadIfc(ifcFileLocation);