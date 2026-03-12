let map = L.map('map').setView([35.68,139.7],10);

let geoLayer;
let cities = [];
let currentCity = null;
let questionCount = 0;
let correctCount = 0;
let maxQuestion = 5;
let gameOver=false;
let answering = false;

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

                if(gameOver) return;
                if(answering) return;
                if(!currentCity) return;

                answering = true;

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
                    setTimeout(()=>{
                        document.getElementById("finalScore").innerHTML =
                            "スコア "+correctCount+" / 5";
                        document.getElementById("gameoverPopup").style.display="flex";
                    },1000);
                    return;
                }else{
                    setTimeout(()=>{
                        answering = false;
                        nextQuestion();
                    },500);
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

    currentCity=cities[Math.floor(Math.random()*cities.length)];

    document.getElementById("question").innerText=
    "第"+(questionCount+1)+"問 : "+currentCity;
}

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

document.getElementById("shareBtn").onclick=function(){
    let shareURL="https://x.gd/tokyomap";

    let text =
        "東京都 市区町村当てゲーム\n"+
        "スコア "+correctCount+"/5\n"+shareURL;

    let url="https://twitter.com/intent/tweet?text="+
        encodeURIComponent(text);

    window.open(url);
}

window.onload = function(){
    document.getElementById("startBtn").onclick=startGame;
    document.getElementById("restartBtn").onclick=function(){
        location.reload();
    }
}
