import ancients from "./assets/Ancients/index.js";
import blueCards from "./assets/MythicCards/blue/index.js";
import brownCards from "./assets/MythicCards/brown/index.js";
import greenCards from "./assets/MythicCards/green/index.js";

const oldSelectPanel = document.querySelector(".select-old"),
  gameMods = document.querySelectorAll(".mode"),
  cardHolder = document.querySelector(".old-card"),
  gameModeSelect = document.querySelector(".game-mode"),
  stageContainer = document.querySelector(".stage-container"),
  cardDeckHolder = document.querySelector(".card-deck-holder"),
  cardShowing = document.querySelector(".active-card-block"),
  gameEnd = document.querySelector(".game-end"),
  gameStart = document.querySelector(".game-start"),
  stageOneBlock = document.querySelector(".stage-one"),
  stageTwoBlock = document.querySelector(".stage-two"),
  stageThreeBlock = document.querySelector(".stage-three");

let gameOnGoing = false,
  gameMode = "",
  ancient = "";

oldSelectPanel.addEventListener("change", function () {
  const old = this.value;
  ancients.forEach((item) =>
    item.title === old ? changeOldCard(item) : 0
  );
});

const changeOldCard = (item) => {
  ancient = item;
  const url = item.src;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    cardHolder.style.background = `url(${url}) no-repeat`;
  };
  gameModeSelect.classList.add("_active");
  showGameOptions();
};

gameMods.forEach((element) =>
  element.addEventListener("click", (e) => {
    const gameModsArr = Array.from(gameMods),
      gameOptionSelected = gameModsArr.filter((element) => element === e.target);
    if (gameOptionSelected) {
      gameMods.forEach((element) =>
        element.classList.contains("_active")
          ? element.classList.remove("_active")
          : 0
      );
      e.target.classList.add("_active");
      gameMode = e.target.classList[1];
      gameStart.classList.add("_active");
    }
  })
);

const shuffleCards = (arr) => {
  const greenCardsValue = arr[0][0] + arr[1][0] + arr[2][0],
    brownCardsValue = arr[0][1] + arr[1][1] + arr[2][1],
    blueCardsValue = arr[0][2] + arr[1][2] + arr[2][2],
    greenCardsArr = [],
    brownCardsArr = [],
    blueCardsArr = [];

  const deckWithDificillity = createDecksWithDificility(
    greenCardsValue,
    brownCardsValue,
    blueCardsValue
  );

  while (greenCardsArr.length < greenCardsValue) {
    const i = Math.floor(Math.random() * deckWithDificillity[0].length);
    if (!greenCardsArr.includes(deckWithDificillity[0][i]["src"])) {
      greenCardsArr.push(deckWithDificillity[0][i]["src"]);
    }
  }
  while (brownCardsArr.length < brownCardsValue) {
    const i = Math.floor(Math.random() * deckWithDificillity[1].length);
    if (!brownCardsArr.includes(deckWithDificillity[1][i]["src"])) {
      brownCardsArr.push(deckWithDificillity[1][i]["src"]);
    }
  }
  while (blueCardsArr.length < blueCardsValue) {
    const i = Math.floor(Math.random() * deckWithDificillity[2].length);
    if (!blueCardsArr.includes(deckWithDificillity[2][i]["src"])) {
      blueCardsArr.push(deckWithDificillity[2][i]["src"]);
    }
  }
  return [greenCardsArr, brownCardsArr, blueCardsArr];
};

const gameStarting = () => {
  hiddenGameOptions();
  let allCards = shuffleCards(ancient.stage);
  let stageSortedUrl = createAllStagesUrls(ancient.stage, allCards);
  updateCardsLeftBlock(stageSortedUrl);
  cardDeckHolder.addEventListener("click", showCards(stageSortedUrl));
};

const createDecksWithDificility = (greenVal, brownVal, blueVal) => {
  const greenArrEasyCards = [],
    greenArrMediumCards = [],
    greenArrHardCards = [],
    brownArrEasyCards = [],
    brownArrMediumCards = [],
    brownArrHardCards = [],
    blueArrEasyCards = [],
    blueArrMediumCards = [],
    blueArrHardCards = [];

  greenCards.forEach((item) => {
    if (item.difficulty === "easy") {
      greenArrEasyCards.push(item);
    } else if (item.difficulty === "normal") {
      greenArrMediumCards.push(item);
    } else {
      greenArrHardCards.push(item);
    }
  });

  brownCards.forEach((item) => {
    if (item.difficulty === "easy") {
      brownArrEasyCards.push(item);
    } else if (item.difficulty === "normal") {
      brownArrMediumCards.push(item);
    } else {
      brownArrHardCards.push(item);
    }
  });

  blueCards.forEach((item) => {
    if (item.difficulty === "easy") {
      blueArrEasyCards.push(item);
    } else if (item.difficulty === "normal") {
      blueArrMediumCards.push(item);
    } else {
      blueArrHardCards.push(item);
    }
  });

  switch (gameMode) {
    case "easiest":
      if (greenArrEasyCards.length < greenVal) {
        addRandomValueToArr(greenArrEasyCards, greenArrMediumCards, greenVal);
      } else if (brownArrEasyCards.length < brownVal) {
        addRandomValueToArr(brownArrEasyCards, brownArrMediumCards, brownVal);
      } else if (blueArrEasyCards.length < blueVal) {
        addRandomValueToArr(blueArrEasyCards, blueArrMediumCards, blueVal);
      }
      return [greenArrEasyCards, brownArrEasyCards, blueArrEasyCards];
    case "easy":
      const easyGreenArr = greenArrMediumCards.concat(greenArrEasyCards),
        easyBrownArr = brownArrMediumCards.concat(brownArrEasyCards),
        easyBlueArr = blueArrMediumCards.concat(blueArrEasyCards);
      return [easyGreenArr, easyBrownArr, easyBlueArr];
    case "hard":
      const hardGreenArr = greenArrHardCards.concat(greenArrMediumCards),
        hardBrownArr = brownArrHardCards.concat(brownArrMediumCards),
        hardBlueArr = blueArrHardCards.concat(blueArrMediumCards);
      return [hardGreenArr, hardBrownArr, hardBlueArr];
    case "hardest":
      if (greenArrHardCards.length < greenVal) {
        addRandomValueToArr(greenArrHardCards, greenArrMediumCards, greenVal);
      } else if (brownArrHardCards.length < brownVal) {
        addRandomValueToArr(brownArrHardCards, brownArrMediumCards, brownVal);
      } else if (blueArrHardCards.length < blueVal) {
        addRandomValueToArr(blueArrHardCards, blueArrMediumCards, blueVal);
      }
      return [greenArrHardCards, brownArrHardCards, blueArrHardCards];
    default:
      return [greenCards, brownCards, blueCards];
  }
};

const addRandomValueToArr = (sourceArr, arr, index) => {
  while (sourceArr.length < index) {
    const num = Math.floor(Math.random() * arr.length);
    sourceArr.push(arr[num]);
  }
};

const showCards = (urls = []) => {
  return (event) => {
    event.preventDefault();
    try {
      findCard(urls);
      updateCardsLeftBlock(urls);
    } catch (error) {}
  };
};

const findCard = (arr) => {
  let card = false;
  if (!card) {
    for (let i = 0; i < 3; i++) {
      if (!card) {
        for (let j = 0; j < 3; j++) {
          if (!card) {
            if (arr[i][j][0].length != 0) {
              card = arr[i][j][0].splice(0, 1);
            }
          }
        }
      }
    }
  }
  setCardOnTable(card, arr);

  if (arr[2][1][0].length === 0 && arr[2][2][0].length === 0) {
    gameOnGoing = false;
  }
};

const setCardOnTable = (url, arr) => {
  if (gameOnGoing === false) {
    alert("Колода закончилась!");
    delete arr[0];
    delete arr[1];
    delete arr[2];
    cardDeckHolder.removeEventListener("click", showCards());

    cardShowing.style.background = "transparent";
  } else {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      cardShowing.style.background = `url(${url}) no-repeat center`;
    };
  }
};

const updateCardsLeftBlock = (arr) => {
  const firstStageGreenCardValue = arr[0][0][0].length,
    secondStageGreenCardValue = arr[1][0][0].length,
    thirdStageGreenCardValue = arr[2][0][0].length,
    firstStageBrownCardValue = arr[0][1][0].length,
    secondStageBrownCardValue = arr[1][1][0].length,
    trirdStageBrownCardValue = arr[2][1][0].length,
    firstStageBlueCardValue = arr[0][2][0].length,
    secondStageBlueCardValue = arr[1][2][0].length,
    thirdStageBlueCardValue = arr[2][2][0].length;

  stageOneBlock.querySelector(".green").textContent = firstStageGreenCardValue;
  stageOneBlock.querySelector(".brown").textContent = firstStageBrownCardValue;
  stageOneBlock.querySelector(".blue").textContent = firstStageBlueCardValue;
  stageTwoBlock.querySelector(".green").textContent = secondStageGreenCardValue;
  stageTwoBlock.querySelector(".brown").textContent = secondStageBrownCardValue;
  stageTwoBlock.querySelector(".blue").textContent = secondStageBlueCardValue;
  stageThreeBlock.querySelector(".green").textContent =
    thirdStageGreenCardValue;
  stageThreeBlock.querySelector(".brown").textContent =
    trirdStageBrownCardValue;
  stageThreeBlock.querySelector(".blue").textContent = thirdStageBlueCardValue;
};

const createAllStagesUrls = (arr, url) => {
  const firstStage = arr[0],
    secondStage = arr[1],
    thirdStage = arr[2],
    stageOneUrl = [],
    stageTwoUrl = [],
    stageThreeUrl = [];

  stageOneUrl.push([url[0].splice(0, firstStage[0])]);
  stageOneUrl.push([url[1].splice(0, firstStage[1])]);
  stageOneUrl.push([url[2].splice(0, firstStage[2])]);
  stageTwoUrl.push([url[0].splice(0, secondStage[0])]);
  stageTwoUrl.push([url[1].splice(0, secondStage[1])]);
  stageTwoUrl.push([url[2].splice(0, secondStage[2])]);
  stageThreeUrl.push([url[0].splice(0, thirdStage[0])]);
  stageThreeUrl.push([url[1].splice(0, thirdStage[1])]);
  stageThreeUrl.push([url[2].splice(0, thirdStage[2])]);

  return [stageOneUrl, stageTwoUrl, stageThreeUrl];
};

const hiddenGameOptions = () => {
  gameModeSelect.classList.remove("_active");
  gameStart.classList.remove("_active");
  stageContainer.classList.add("_active");
  cardDeckHolder.classList.add("_active");
  cardShowing.classList.add("_active");
  gameEnd.classList.add("_active");
  gameOnGoing = true;
};

const showGameOptions = () => {
  gameModeSelect.classList.add("_active");
  gameEnd.classList.remove("_active");
  stageContainer.classList.remove("_active");
  cardDeckHolder.classList.remove("_active");
  cardShowing.classList.remove("_active");
  gameOnGoing = false;
};

gameStart.addEventListener("click", gameStarting);
gameEnd.addEventListener("click", showGameOptions);