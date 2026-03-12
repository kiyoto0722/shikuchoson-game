let map = L.map('map').setView([35.68,139.7],10);

let geoLayer;
let cities = [];
let currentCity = null;
let questionCount = 0;
let correctCount = 0;
let maxQuestion = 5;
let gameOver=false;

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

            let name = feature.properties.N03_004;
            if(!cities.includes(name)){
                if(
                    name.endsWith("区") ||
                    name.endsWith("市") ||
                    name.endsWith("町") ||
                    name.endsWith("村")
                ){
                    cities.push(name);
                }
            }

            layer.on("click",()=>{

                if(!currentCity) return;

                let name = feature.properties.N03_004;

                if(name===currentCity){

                    layer.setStyle({
                        fillColor:"#00ff00"
                    });

                    correctCount++;

                    showJudge(true);

                }else{

                    layer.setStyle({
                        fillColor:"#0000ff"
                    });

                    geoLayer.eachLayer(function(l){
                        if(l.feature.properties.N03_004===currentCity){
                            l.setStyle({fillColor:"#ff0000"});
                        }
                    });

                    showJudge(false);
                }

                questionCount++;

                if(questionCount>=maxQuestion){
                    gameOver=true;
                    document.getElementById("finalScore").innerHTML=
                        "スコア "+score+" / 5";
                    document.getElementById("gameoverPopup").style.display="flex";
                    return;
                }

                }else{

                    setTimeout(nextQuestion,500);
                }

            });

        }

    }).addTo(map);

    //map.fitBounds(geoLayer.getBounds());
});

function startGame(){

    questionCount=0;
    correctCount=0;

    nextQuestion();
}

function nextQuestion(){

    geoLayer.resetStyle();

    let r = Math.floor(Math.random()*cities.length);

    currentCity=cities[Math.floor(Math.random()*cities.length)];

    document.getElementById("question").innerText=
    "第"+(questionCount+1)+"問 : "+currentCity;
}

//function showResult(){

//    let rank="";

//    if(correctCount==5) rank="S";
//    else if(correctCount>=4) rank="A";
//    else if(correctCount>=3) rank="B";
//    else if(correctCount>=2) rank="C";
//    else rank="D";

//    document.getElementById("question").innerText=
//    "終了！ "+correctCount+" / 5 正解 ランク "+rank;
//}

function showJudge(correct){

    const result=document.getElementById("result");

    if(correct){
        result.innerHTML="⭕";
        result.style.color="red";
    }else{
        result.innerHTML="✕";
        result.style.color="blue";
    }

    setTimeout(()=>{
        result.innerHTML="";
    },1000);
}

document.getElementById("startBtn").onclick=startGame;
document.getElementById("restartBtn").onclick=function(){
    location.reload();
}
