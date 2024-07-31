const moves = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const result = document.getElementById('result');
const gameContainer = document.querySelector('.game-container');
const controls = document.querySelector('.controls-container');
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// items array

const items = [
    { name: "bee", image: "./assets/bee.png" },
    { name: "crocodile", image: "./assets/crocodile.png" },
    { name: "macaw", image: "./assets/macaw.png" },
    { name: "gorilla", image: "./assets/gorilla.png" },
    { name: "tiger", image: "./assets/tiger.png" },
    { name: "monkey", image: "./assets/monkey.png" },
    { name: "chameleon", image: "./assets/chameleon.png" },
    { name: "piranha", image: "./assets/piranha.png" },
    { name: "anaconda", image: "./assets/anaconda.png" },
    { name: "sloth", image: "./assets/sloth.png" },
    { name: "cockatoo", image: "./assets/cockatoo.png" },
    { name: "toucan", image: "./assets/toucan.png" },
];

// initial time 
let seconds = 0;
let minutes = 0;

// initial moves and win count
let movesCount = 0;
let winCount = 0;

// for timer
const timeGenerator = () => {
    seconds+=1;
    // minutes logic
    if(seconds >= 60){
        minutes += 1;
        seconds = 0;    
    }
    // format time before displaying
    let secondValue = seconds < 10 ? `0${seconds}` : seconds;
    let minuteValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minuteValue}:${secondValue}`;
};

//For calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`
}

//Pick random objects from items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4)/2 since pairs objects would exist
    size = (size * size) / 2;
    //Random object selection
    for(let i = 0; i < size; i++){
        //random index
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        //pick item
        const item = tempArray[randomIndex];
        //push to cardValues
        cardValues.push(item);
        //remove item from temp array
        tempArray.splice(randomIndex,1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues , size = 4) => {
    gameContainer.innerHTML = "";  
    cardValues = [...cardValues , ...cardValues ];
    //simple shuffle
    cardValues.sort(()=>Math.random() - 0.5);
    for(let i = 0; i < size * size; i++){
        /*
            create cards
            before => front side (contains question mark)
            after => back side (contains actual image)
            data-card-values is a custom attribute which stores the name of the card to match later
        */
        gameContainer.innerHTML += `
            <div class="card-container" data-card-value="${cardValues[i].name}">
                <div class="card-before">?</div>   
                <div class="card-after">
                    <img src="${cardValues[i].image}" class="image" alt="${cardValues[i].name}">
                </div>
            </div>
        `
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");
    let firstCardValue;
    cards.forEach(card => {
        card.addEventListener('click',() => {
            if(!card.classList.contains('matched') && card !== firstCard){
                //flip the card
                card.classList.add('flipped');
                //if it is first click
                if(!firstCard){
                    firstCard = card;
                    firstCardValue = card.getAttribute('data-card-value');
                }else{
                    //increament moves counter
                    movesCounter();
                    //secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute('data-card-value');
                    if(firstCardValue === secondCardValue){
                        // if both cards match ,these cards would be ignored next time
                        firstCard.classList.add('matched');
                        secondCard.classList.add('matched');
                        // set first card to be false since next click will be the first card
                        firstCard = false;
                        //winCount increament as user found a correct match
                        winCount += 1;
                        //check if winCount ==half of the cardValues
                        if(winCount == Math.floor(cardValues.length / 2)){
                            result.innerHTML = `<h2>You won</h2>
                            <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    }else{
                        //if both cards don't match
                        //flip the cards back
                        let [tempFirst,tempSecond] = [firstCard,secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove('flipped');
                            tempSecond.classList.remove('flipped')
                        },900)
                    }
                }
            }
        })
    })
};
//initialize values and func calls 
const initializer = () => {
    result.innerText = "" ;
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};

//Start game
startButton.addEventListener('click', () => {
    movesCount = 0;
    seconds=0;
    minutes=0;
    controls.classList.add('hide');
    stopButton.classList.remove('hide');
    startButton.classList.add('hide');
    //start timer
    interval = setInterval(timeGenerator,1000);
    //initialize moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

// stop game 
stopButton.addEventListener('click',(stopGame = () => {
    controls.classList.remove('hide');
    stopButton.classList.add('hide');
    startButton.classList.remove('hide');
    clearInterval(interval);
}));




