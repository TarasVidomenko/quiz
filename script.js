let welcomeScreen = document.querySelector(".welcome");
let quizScreen = document.querySelector(".quiz");
let resultScreen = document.querySelector(".result");
let startQuizBtn = document.querySelector(".start-quiz-btn");
let answerBtns = document.querySelectorAll(".answer");
let restartQuizBtn = document.querySelector(".restart-quiz-btn");
let quizQuestion = document.querySelector(".quiz__question")
let resultTitle = document.querySelector(".result__title")
let quizCounter = document.querySelector(".quiz__counter span")
let timerElement = document.querySelector(".timer") // отримали дув з класом таймер
let interval // створили змінну для нашого інтурвалу
let startTimerValue = 10 // встановили початкове значеня для таймеру

function startTimer() {    
 timerElement.innerHTML = startTimerValue 

 interval = setInterval(function() {  
 if (startTimerValue == 1) {   
 timerElement.innerHTML = 0   
 clearInterval(interval)   
 showQuestionResult("red") 
 showNextQuestion ()      
 } else {   
 startTimerValue--  
 timerElement.innerHTML = startTimerValue  
 }
 }, 1000) 
}

let allQuestion = [
    {
        question: "Скільки хромосом у людини?",
        answers: [60, 36, 47, 46, 59],
        correctAnswer: 46
    },
    {
        question: "Який найдовший орган у людини?",
        answers: ["Шкіра", "Кишечник","Спиний мозок" ,"Тонкий кишечник" ,"Товстий кишечник" ],
        correctAnswer: "Шкіра"
    },
     {
        question: "Скільки океанів є на нашій планеті?",
        answers: [2, 5, 3, 4,6],
        correctAnswer: 4
    },
    {
        question: "Скільки країн є на нашій планеті? ",
        answers: [195, 183, 216,154 , 96],
        correctAnswer: 195
    },
    {
        question: "В якій країні най більше населеня?",
        answers: ["Росія","Індія","Китай","Америка","Індонезія"],
        correctAnswer: "Індія"
    }
]
let userPoint = 0
let currQuestionNumber = 0

function renderQuestion(quest) {
    quizQuestion.innerHTML = quest.question
    answerBtns.forEach((btn, i) => btn.innerHTML = quest.answers[i])
    startTimer()
}

function showQuestionResult(color) {
    quizScreen.style.background = color

 setTimeout(() => {
        quizScreen.style.background = "#C0C0C0"
    }, 600)
}

function disabledButton(option) {
    answerBtns.forEach(btn => btn.disabled = option)
}
const sliderContainer = document.querySelector('.slider');
var vertex = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

var fragment = `
    varying vec2 vUv;

    uniform sampler2D currentImage;
    uniform sampler2D nextImage;
    uniform sampler2D disp;

    uniform float dispFactor;
    float intensity = 0.25;
    void main() {

        vec2 uv = vUv;

        vec4 disp = texture2D(disp, uv);

        vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*intensity), uv.y);
        vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*intensity), uv.y);

        vec4 _currentImage = texture2D(currentImage, distortedPosition);
        vec4 _nextImage = texture2D(nextImage, distortedPosition2);

        vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);

        gl_FragColor = finalTexture;
    }
`;

// Scene
let scene = new THREE.Scene();
const imgs = Array.from(document.querySelectorAll('.slide-img'));
const sliderImages=[]
let renderWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let renderHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const camera = new THREE.PerspectiveCamera(
    60,
    renderWidth / renderHeight,
    1,
    100
)
camera.position.z = 1

// Renderer
let renderer = new THREE.WebGLRenderer({
    antialias: true,
});
// Renderer opts
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor( 0x23272A, 1.0 );
renderer.setSize( renderWidth, renderHeight );


// add the renderer to the dom
sliderContainer.appendChild( renderer.domElement );


let textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "anonymous";

imgs.forEach( ( img ) => {
    let image = textureLoader.load( img.getAttribute( 'src' ));
    image.magFilter = image.minFilter = THREE.LinearFilter;
    image.anisotropy = renderer.capabilities.getMaxAnisotropy();
    sliderImages.push( image );
});

let dispImg = textureLoader.load('https://assets.codepen.io/590856/freesolo-texture.jpg');

// let dispImg = textureLoader.load('https://assets.codepen.io/590856/freesolo-texture2.jpg');
// let dispImg = textureLoader.load('https://assets.codepen.io/590856/freesolo-texture3.jpg');


dispImg.wrapS = dispImg.wrapT = THREE.RepeatWrapping;

let mat = new THREE.ShaderMaterial({
    uniforms: {
        dispFactor: { type: "f", value: 0.0 },
        currentImage: { type: "t", value: sliderImages[0] },
        nextImage: { type: "t", value: sliderImages[1] },
        disp: { type: "t", value: dispImg },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    opacity:1.0
});

let geometry = new THREE.PlaneBufferGeometry(
    2.4,1.16
);

let object = new THREE.Mesh(geometry, mat);
object.position.set(0, 0, 0);
scene.add(object);

window.addEventListener('resize',() => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

let animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

let index = 0;
const slider = document.querySelector('.slider-inner');
const slide = document.querySelectorAll('.slide')
const slideImg = document.querySelector('.slide-background-img')
const next = document.querySelector(".slider-next-btn");
const prev = document.querySelector(".slider-prev-btn");
const slideNum = document.querySelector('.slide-indicator');
const description = document.querySelectorAll('.slide-description');
const title = document.querySelectorAll('.slide-title');
const descriptionArray = Array.from(description);

// Position all description elements 
TweenMax.set(descriptionArray[2],{y:"-100%"})
TweenMax.set(descriptionArray[3],{y:"-200%"})
// Slide to the right 
let autoPlay = true;

let isSliding = false;

let slideTl = (transformVal,transformVal2,elIndex) => {
    const tl = new TimelineMax({
        onStart:()=> {
            isSliding = true
        },
        onComplete:() => {
            isSliding = false
        }
    });
    tl.to(slider,0.85,{x:transformVal,ease:Sine.easeInOut},'slide')
    .to(slideNum,0.85,{y:transformVal2,ease:Sine.easeInOut},'slide')
    .fromTo(descriptionArray[elIndex],0.25,{y:0},{y:"+=100%",ease:Circ.easeIn},'slide')
    .fromTo(descriptionArray[index],0.3,{y:0},{y:"-=100%"},'slide+=0.75')
    .set(title[elIndex],{className:"-=active"},'slide')
    .set(title[index],{className:"+=active"},'slide')    
    return tl;
}   
const animateDisplace = () => {
    mat.uniforms.nextImage.value = sliderImages[index];
    mat.uniforms.nextImage.needsUpdate = true;

    TweenLite.to( mat.uniforms.dispFactor, 1, {
        value: 1,
        ease: 'Sine.easeInOut',
        onComplete: () => {
            mat.uniforms.currentImage.value = sliderImages[index];
            mat.uniforms.currentImage.needsUpdate = true;
            mat.uniforms.dispFactor.value = 0.0;   
        }
    });
}
const nextSlide = () => {  
    if (isSliding == false) {
        index ++
        slideTl("-=100%","-=25%",index - 1);
        animateDisplace();
    }    
}

const prevSlide = () => {
    if (isSliding == false) {
        index --
        slideTl("+=100%","+=25%",index + 1);
        animateDisplace();
    } 
}

// ANIMATE SLIDE INDICATOR
const progressEase = "M0,0 C0.092,0.01 0.162,0.108 0.212,0.21 0.328,0.448 0.458,1 1,1";
const progressBar = CSSRulePlugin.getRule('.slide-progress-bar:after');
const progressTl = (delay) => {
    const tl = new TimelineMax({
        repeat:-1,
        repeatDelay:1.5,
        paused:true,
        delay:delay
    });
    tl.fromTo(progressBar,2,{cssRule:{x:"-100%"}},{cssRule:{x:"0%"},ease:CustomEase.create("custom",progressEase)})
        .add(() => {
            if (index <= 2 && autoPlay === true) {
                nextSlide();
                TweenMax.to(progressBar,1,{cssRule:{x:"100%"},ease:CustomEase.create("custom",progressEase)})
            }
            if (index === 3 && autoPlay === true) {
                tl.stop();
            }
        })
    return tl;
}
const animateProgress = progressTl(0.4);

// Reset progress bar on hover
const resetProgress = () => {
    if (index < 3 && autoPlay === true) {
        TweenMax.to(animateProgress,
            1 * animateProgress.progress(),{
                progress:0,
                onComplete:()=> {
                    animateProgress.progress(0)
                    animateProgress.stop();
                }
            }
        )
    }
}
// Change Timeline state 
const changeState = (timeline) => {
    if (timeline.progress() == 1) {
        timeline.reverse()
    }
    else {
        timeline.play()
    } 
}

// ANIMATE SEARCH ICON
const searchBtn = document.querySelector('.search-btn')
const searchInput = document.querySelector('.search-input')
const searchTl = () => {
    const tl = new TimelineLite({paused:true});
    tl.to(searchInput,0.15,{width:"225px",fontSize:"16px"},'in')

    return tl;
}
const animateSearch = searchTl()

// ANIMATE MENU ICON
const menuBtn = document.querySelector('.menu-btn')
const menu = document.querySelector('.menu');
const menuTl = () => {
    const tl = new TimelineLite({paused:true})
    tl.to(menu,0.2,{x:0,ease:Sine.easeInOut},'in')
    return tl;
}
const animateMenu = menuTl()

// Click Event listener slider buttons
next.addEventListener('click',() => {
    if (index < 3) {
        nextSlide();
    } 
})
prev.addEventListener('click',() => {
    if (index > 0) {
        prevSlide();
    }
})
// Hover Event listeners for buttons
// reset or restart progress bar animation on enter/leave
next.addEventListener('mouseenter',() => {
    resetProgress();   
})
prev.addEventListener('mouseenter',() => {
    resetProgress();  
})

next.addEventListener('mouseleave',() => {
    animateProgress.progress(0)
    animateProgress.restart()
})
prev.addEventListener('mouseleave',() => {
    animateProgress.progress(0)
    animateProgress.restart()
})

// Search event listener
// toggle search
searchBtn.addEventListener('click',() =>{
    changeState(animateSearch)
})
// Menu event Listener
// toggle menu
menuBtn.addEventListener('click',() => {
    changeState(animateMenu)
})

// IMAGESLOADED
const loader = document.querySelector('.preloader'),
loaderOutline = document.querySelector('#preloader-outline'),
loaderBot = document.querySelector('#preloader-bot'),
snow = document.querySelectorAll('#snowGroup path');

TweenMax.set('svg',{visibility:"visible"})
TweenMax.set(loaderOutline,{drawSVG:"0% 0%"})
TweenMax.set(snow,{drawSVG:"0% 0%"})
TweenMax.set(loaderBot,{drawSVG:"50% 50%"})

imgToLoad = document.querySelectorAll('img , canvas');
imgLoad = imagesLoaded(imgToLoad)

let loadedCount = 0
let loadingProgress = 0

const imgLoadTl = new TimelineMax({
    onComplete:() => {
        TweenLite.to(loader,0.4,{opacity:0})
        TweenLite.set(loader,{visibility:"hidden",delay:0.4})
        // Start sliding -- animate the progress bar 
        animateProgress.play();
    }
});
// Animate the logo 
imgLoadTl
    .to(loaderOutline,1,{drawSVG:"0% 100%"},'in')
    .to(loaderBot,1.5,{drawSVG:"0% 100%"},'in')
    .staggerTo(snow,0.4,{drawSVG:"0% 100%"},0.35,'in+=0.45')

imgLoad.on('progress',() => {
    loadedCount++
    let loadingProgress = loadedCount / imgToLoad.length;
    // Animate the progress of the logo animation
    TweenLite.to(imgLoadTl,0.5,{progress:loadingProgress,ease:Linear.easeNone})
});

function deleteActiveScreen() {
  welcomeScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");
}

function runQuiz() {
  deleteActiveScreen();
  quizScreen.classList.add("active");
  currQuestionNumber = 0
    userPoint = 0
    renderQuestion(allQuestion[currQuestionNumber])
    quizCounter.innerHTML = currQuestionNumber + 1
}

function finishQuiz() {
  deleteActiveScreen();
  resultScreen.classList.add("active");
  resultTitle.innerHTML =  `Вітаю, ти закінчив опитування і отримав ${userPoint} з ${allQuestion.length}`
}

startQuizBtn.addEventListener("click", runQuiz);
restartQuizBtn.addEventListener("click", runQuiz);



            
answerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        clearInterval(interval)
    
         if (btn.innerHTML == allQuestion[currQuestionNumber].correctAnswer) {
            userPoint++
            showQuestionResult("lightgreen")
        } else {
            showQuestionResult("red")
        }
        showNextQuestion()
    } )
})
function showNextQuestion() {
    disabledButton(true)

    startTimerValue = 10
        setTimeout(() => {
            if (currQuestionNumber == allQuestion.length - 1) {
                finishQuiz()
            } else {
                currQuestionNumber++
                renderQuestion(allQuestion[currQuestionNumber])
                quizCounter.innerHTML = currQuestionNumber + 1
            }
            disabledButton(false)
        }, 800)
}
