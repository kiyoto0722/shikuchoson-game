let map = L.map('map').setView([35.68,139.7],10)

L.tileLayer('',{attribution:''}).addTo(map)

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
color:"#000",
weight:1,
fillColor:"#00aa00",
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

document.getElementById("question").innerHTML="ゲーム終了"

return

}

targetCity=questions[current]

document.getElementById("question").innerHTML=
targetCity.properties.name

current++

}

map.on("click",function(e){

if(!targetCity)return

let pt=turf.point([e.latlng.lng,e.latlng.lat])

let inside=turf.booleanPointInPolygon(pt,targetCity)

geoLayer.eachLayer(function(layer){

if(layer.feature===targetCity){

if(inside){

layer.setStyle({fillColor:"#00ff00"})

}else{

layer.setStyle({fillColor:"#ff0000"})

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