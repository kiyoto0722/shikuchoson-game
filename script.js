
let map = L.map('map',{zoomControl:false}).setView([35.68,139.7],10)

let geoLayer
let tokyoData

let questions=[]
let current=0
let targetCity=null

fetch("tokyo.geojson")
.then(res=>res.json())
.then(data=>{

tokyoData=data

geoLayer=L.geoJSON(data,{
style:{
color:"#222",
weight:1,
fillColor:"#2ecc71",
fillOpacity:0.7
}
}).addTo(map)

map.fitBounds(geoLayer.getBounds())

})

document.getElementById("startBtn").onclick=function(){

questions=shuffle(tokyoData.features).slice(0,5)
current=0
nextQuestion()

}

function nextQuestion(){

if(current>=5){

document.getElementById("question").innerHTML="ゲーム終了！"
targetCity=null
return

}

targetCity=questions[current]

document.getElementById("question").innerHTML="問題: "+targetCity.properties.name

current++

}

map.on("click",function(e){

if(!targetCity)return

let pt=turf.point([e.latlng.lng,e.latlng.lat])

let inside=turf.booleanPointInPolygon(pt,targetCity)

geoLayer.eachLayer(function(layer){

if(layer.feature===targetCity){

if(inside){

layer.setStyle({fillColor:"#7CFF7C"})

}else{

layer.setStyle({fillColor:"#FF4C4C"})

}

}

})

setTimeout(nextQuestion,1500)

})

function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))
[array[i],array[j]]=[array[j],array[i]]

}

return array

}
