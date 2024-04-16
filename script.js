'use strict';

// selecting elements

const diceImg = document.querySelectorAll('.dice');
// const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const diceRollArea = document.querySelector('.dice-roll-area');
const scoresTable = document.querySelector('tbody');
const onesScore = document.querySelector('#ones-score');
const twosScore = document.querySelector('#twos-score');
const threesScore = document.querySelector('#threes-score');
const foursScore = document.querySelector('#fours-score');
const fivesScore = document.querySelector('#fives-score');
const sixesScore = document.querySelector('#sixes-score');
const upperScore = document.querySelector('#upper-score');
const bonusScoreEl = document.querySelector('#bonus-score');
const threeKind = document.querySelector('#three-kind-score');
const fourKind = document.querySelector('#four-kind-score');
const fullhouse = document.querySelector('#fullhouse-score');
const smallStraight = document.querySelector('#sm-straight-score');
const largeStraight = document.querySelector('#lg-straight-score');
const chanceScore = document.querySelector('#chance-score');
const yahtzee = document.querySelector('#yahtzee-score');
const totalTable = document.querySelector('.score-cell--total');

const rollsLeft = document.querySelector('.rolls-left');
const roundsLeft = document.querySelector('.rounds-left');

// rounds and rolls
const maxRound = 13;
let curRound = 1;

const maxRoll = 3;
let curRoll = 0;

const displayRolls = () => (rollsLeft.textContent = `${curRoll}/${maxRoll}`);
const displayRound = () => (roundsLeft.textContent = `${curRound}/${maxRound}`);
displayRound();
displayRolls();
// scores

const scores = new Map([
  ['1', 0],
  ['2', 0],
  ['3', 0],
  ['4', 0],
  ['5', 0],
  ['6', 0],
  ['7', 0],
  ['8', 0],
  ['9', 0],
  ['10', 0],
  ['11', 0],
  ['12', 0],
  ['13', 0],
]);

let upperTotalScore = 0;
let lowerTotalScore = 0;
let bonusScore = 0;
let totalScore = 0;

const calcScores = function (dice) {
  const diceMap = new Map();
  dice.forEach(function (roll) {
    if (diceMap.has(roll)) diceMap.set(roll, diceMap.get(roll) + 1);
    else diceMap.set(roll, 1);
  });
  const diceSortedStr = [...diceMap.keys()].sort().join('');
  console.log(diceSortedStr);
  const upperScores = (roll) =>
    (diceMap.has(roll) && diceMap.get(roll) * roll) || 0;

  if (!onesScore.classList.contains('scored'))
    onesScore.textContent = upperScores(1);

  if (!twosScore.classList.contains('scored'))
    twosScore.textContent = upperScores(2);

  if (!threesScore.classList.contains('scored'))
    threesScore.textContent = upperScores(3);

  if (!foursScore.classList.contains('scored'))
    foursScore.textContent = upperScores(4);

  if (!fivesScore.classList.contains('scored'))
    fivesScore.textContent = upperScores(5);

  if (!sixesScore.classList.contains('scored'))
    sixesScore.textContent = upperScores(6);
  // bonus
  // 3 of a kind
  const xOfKind = function (map, searchValue) {
    for (const [key, value] of map.entries()) {
      if (value === searchValue) return true;
    }
    return false;
  };

  const sum = dice.reduce((sum, roll) => sum + roll, 0);
  if (!threeKind.classList.contains('scored'))
    threeKind.textContent = xOfKind(diceMap, 3) || diceMap.size < 3 ? sum : 0;

  // 4 of a kind
  if (!fourKind.classList.contains('scored'))
    fourKind.textContent = xOfKind(diceMap, 4) || diceMap.size < 2 ? sum : 0;

  // fullhouse
  if (!fullhouse.classList.contains('scored'))
    fullhouse.textContent = xOfKind(diceMap, 3) && xOfKind(diceMap, 2) ? 25 : 0;

  // small straight
  if (!smallStraight.classList.contains('scored'))
    smallStraight.textContent =
      diceSortedStr.includes('1234') ||
      diceSortedStr.includes('2345') ||
      diceSortedStr.includes('3456')
        ? 30
        : 0;

  // large straight
  if (!largeStraight.classList.contains('scored'))
    largeStraight.textContent =
      diceMap.size === 5 && (!diceMap.has(1) || !diceMap.has(6)) ? 40 : 0;

  // yahtzee
  if (!yahtzee.classList.contains('scored'))
    yahtzee.textContent = diceMap.size === 1 ? 50 : 0;

  // chance
  if (!chanceScore.classList.contains('scored')) chanceScore.textContent = sum;
};

const updateScore = function () {
  upperTotalScore = [...scores.values()].reduce(
    (acc, cur, i) => (i <= 5 ? acc + cur : acc),
    0
  );
  lowerTotalScore = [...scores.values()].reduce(
    (acc, cur, i) => (i >= 6 ? acc + cur : acc),
    0
  );
  bonusScore = upperTotalScore >= 63 ? 35 : 0;
  totalScore = upperTotalScore + lowerTotalScore + bonusScore;

  upperScore.textContent = upperTotalScore;
  bonusScoreEl.textContent = bonusScore;
  totalTable.textContent = totalScore;
};

// roll dice function
const diceRollsArr = [0, 0, 0, 0, 0];

btnRoll.addEventListener('click', function () {
  if (curRoll < maxRoll && curRound <= maxRound) {
    diceImg.forEach(function (die, i) {
      if (!die.classList.contains('dice--hold')) {
        const random = Math.floor(Math.random() * 6 + 1);
        die.src = `dice-${random}.png`;
        diceRollsArr[i] = random;
      }
    });
    console.log(diceRollsArr);
    calcScores(diceRollsArr);
    curRoll++;
  }
  displayRolls();
});

diceRollArea.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('dice') && curRoll !== 0) {
    e.target.classList.toggle('dice--hold');
  }
});

scoresTable.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('score-cell')) {
    e.target.classList.add('scored');
    scores.set(e.target.dataset.cell, Number.parseInt(e.target.textContent));
    updateScore();
    // console.log(scores);
    diceImg.forEach((die) => die.classList.remove('dice--hold'));

    curRound++;
    curRoll = 0;
    displayRound();
    displayRolls();
  }
});
