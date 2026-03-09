
let map = L.map('map').setView([35.68,139.76],10)

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{ attribution:'© OpenStreetMap'}
).addTo(map)

let geoLayer
let features=[]
let answer=null
let score=0
let q=0

async function startGame(){

score=0
q=0

let pref=document.getElementById("pref").value

let res=await fetch(pref+".geojson")
let geo=await res.json()

features=geo.features

if(geoLayer) map.removeLayer(geoLayer)

geoLayer=L.geoJSON(geo,{
style:{
color:"#333",
weight:1,
fillColor:"green",
fillOpacity:0.6
},
onEachFeature:(feature,layer)=>{

layer.on("click",()=>{

if(!answer) return

if(feature.properties.name==answer.properties.name){

score++
layer.setStyle({fillColor:"lime"})
document.getElementById("result").innerHTML="⭕ 正解"

}else{

layer.setStyle({fillColor:"red"})
document.getElementById("result").innerHTML="❌ 不正解<br>正解："+answer.properties.name

}

answer=null

setTimeout(nextQuestion,1200)

})

}
}).addTo(map)

map.fitBounds(geoLayer.getBounds())

nextQuestion()

}

function nextQuestion(){

document.getElementById("result").innerHTML=""

q++

if(q>5){
showResult()
return
}

answer=features[Math.floor(Math.random()*features.length)]

document.getElementById("question").innerHTML=
"問題 "+q+"/5<br><b>"+answer.properties.name+"</b>"

}

function showResult(){

let rank="D"

if(score==5) rank="S 日本地理神"
else if(score==4) rank="A 地理つよい"
else if(score==3) rank="B 普通"
else if(score==2) rank="C 要勉強"

document.getElementById("question").innerHTML="結果"

document.getElementById("result").innerHTML=
score+"/5 正解<br><br>ランク "+rank

}
