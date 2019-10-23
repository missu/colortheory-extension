import { colorTheory } from './modules/color-theory.js';
   
let app = document.getElementById("app");
let appStateEvent = new Event('AppStateUpdated');
let colorPicker = document.getElementById("color-picker");
let submitBtn = document.getElementsByTagName("button")[0];
  
window.addEventListener("DOMContentLoaded", setup);
app.addEventListener("AppStateUpdated", render);
colorPicker.addEventListener("change", onChange);
submitBtn.addEventListener("click", onSubmit);
// TODO: add validation to inputs to restrict rgb only to 0-255
// TODO: check for color keyword when entered
  
let appState = {
    "backgroundColor" : "",
    "colorHex": "",
    "colorRGB" :"",
    "colorKeyword" : "",
    "compliment" : "",
    "shades": [],
    "tints": [],
    "tones" : []
};
  
function setup(){
    let color = `${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)}`;
    updateState(updateColor(color));
}
  
function updateColor(color){  
    let newState = {
        "backgroundColor" : updateBgColor(color),
        "colorHex": colorTheory.rgbToHex(color),
        "colorRGB" : colorTheory.hexToRgb(color),
        "colorKeyword" : colorTheory.hexToName(colorTheory.rgbToHex(color)) || "",
        "compliment" : colorTheory.rgbToHex(colorTheory.compliment(color)),
        "shades": colorTheory.shades(colorTheory.rgbToHex(color)),
        "tints": colorTheory.tints(colorTheory.rgbToHex(color)),
        "tones" : colorTheory.tones(colorTheory.rgbToHex(color))
    }
    console.log('newState', newState);
    return newState;
}
  
function updateBgColor(color) {
    // TODO: Check to see it the background color doesn't
    // clash with the current color or compliment
    let bg ="#FFFFFF";
    return bg;
}
  
function updateState(stateObj){
    appState = Object.assign({}, appState, stateObj);
    app.dispatchEvent(appStateEvent);
}
  
function onChange(event) {
    let color = event.target.value;

    if (color !== appState.colorHex){
        updateState(updateColor(color));
    }
}
  
function onSubmit(event) {
    const hex = document.getElementById("hex-text").value.trim();
    const r = document.querySelector('input[name="r"]').value.trim();
    const g = document.querySelector('input[name="g"]').value.trim();
    const b = document.querySelector('input[name="b"]').value.trim();
    const rgb = `${r},${g},${b}`;
    const keyword  = document.getElementById("color-keyword-text").value.toLowerCase().trim();
 
    if (hex !== appState.colorHex) {
        updateState(updateColor(hex));
    } else if (rgb !== appState.colorRGB) {
        updateState(updateColor(rgb));
    } else if (keyword && keyword !== appState.colorKeyword) {
        let color = colorTheory.nameToHex(keyword);
        if (color) {
            updateState(updateColor(color));
        } else {
            document.getElementById("color-keyword-text").value = "";
        }
        // TODO: add a message telling the user there wasn't a keyword match
    }  
}
  
function render() {
    document.getElementById("color-picker").value = appState.colorHex;
    document.getElementById("hex-text").value = appState.colorHex;
    document.getElementById("color-keyword-text").value = appState.colorKeyword;
    const rgb = appState.colorRGB.split(",");
    document.querySelector('input[name="r"]').value = rgb[0];
    document.querySelector('input[name="g"]').value = rgb[1];
    document.querySelector('input[name="b"]').value = rgb[2];
    
    const compliment = document.getElementById("compliment-color")
    compliment.style.backgroundColor = appState.compliment;
    compliment.children[0].textContent = appState.compliment;
    
    const shadesParent = document.querySelector("#shades .color-list");
    renderList(shadesParent, appState.shades);
  
    const tintsParent = document.querySelector("#tints .color-list");
    renderList(tintsParent, appState.tints);
  
    const tonesParent = document.querySelector("#tones .color-list");
    renderList(tonesParent, appState.tones);
}
  
function renderList(parent, colors){
    let children = parent.children;
    
    for (let i = 0; i < children.length; i++) {
        children[i].style.backgroundColor = colors[i];
        children[i].children[0].textContent = colors[i];
    }
}
  