import * as fabric from 'fabric';
const canvas = new fabric.Canvas(null);
console.log(Object.keys(canvas).filter(k => k.toLowerCase().includes('point')));
console.log(Object.getPrototypeOf(canvas).getScenePoint ? 'has getScenePoint' : 'no getScenePoint');
console.log(Object.getPrototypeOf(canvas).getPointer ? 'has getPointer' : 'no getPointer');
