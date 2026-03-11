let map = L.map('map').setView([35.68,139.7],10);

let geoLayer;
let cities = [];
let currentCity = null;
let questionCount = 0;
let correctCount = 0;
let maxQuestion = 5;

fetch("tokyo_cities.geojson")
.then(res=>res.json())
.then(data=>{

    geoLayer = L.geoJSON(data,{
        style:{
            color:"#006400",
            weight:1,
            fillColor:"#00aa00",
            fillOpacity:1
        },
        onEachFeature:(feature,layer)=>{

            cities.push(feature);

            layer.on("click",()=>{

                if(!currentCity) return;

                let name = feature.properties.N03_004;

                if(name===currentCity){

                    layer.setStyle({
                        fillColor:"#00ff00"
                    });

                    correctCount++;

                    alert("正解！ "+name);

                }else{

                    layer.setStyle({
                        fillColor:"#ff0000"
                    });

                    alert("不正解 正解は "+currentCity);
                }

                questionCount++;

                if(questionCount>=maxQuestion){

                    setTimeout(showResult,500);

                }else{

                    setTimeout(nextQuestion,500);
                }

            });

        }

    }).addTo(map);
map.fitBounds(geoLayer.getBounds());
});

function startGame(){

    questionCount=0;
    correctCount=0;

    nextQuestion();
}

function nextQuestion(){

    geoLayer.resetStyle();

    let r = Math.floor(Math.random()*cities.length);

    currentCity = cities[r].properties.N03_004;

    document.getElementById("question").innerText=
    "第"+(questionCount+1)+"問 : "+currentCity;
}

function showResult(){

    let rank="";

    if(correctCount==5) rank="S";
    else if(correctCount>=4) rank="A";
    else if(correctCount>=3) rank="B";
    else if(correctCount>=2) rank="C";
    else rank="D";

    document.getElementById("question").innerText=
    "終了！ "+correctCount+" / 5 正解 ランク "+rank;
}

document.getElementById("startBtn").onclick=startGame;
