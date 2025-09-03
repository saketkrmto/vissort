const barsContainer = document.getElementById("bars");
let array = [];
let originalArray = [];
let steps = [];
let currentStep = 0;
let interval = null;

function render(active = []) {
  barsContainer.innerHTML = "";
  if (array.length === 0) return;

  const maxVal = Math.max(...array, 0);
  const minVal = Math.min(...array, 0);
  const absMax = Math.max(Math.abs(maxVal), Math.abs(minVal));
  const wrapperHeight = document.getElementById("bars-wrapper").offsetHeight - 20;

  const absScaleFactor = (wrapperHeight) / absMax;

  array.forEach((val, i) => {
    const bar = document.createElement("div");
    const barHeight = Math.abs(val) * absScaleFactor;
    
    bar.style.height = `${barHeight}px`;

    if (val >= 0) {
      bar.classList.add("bar", "positive");
    } else {
      bar.classList.add("bar", "negative");
    }

    if (active.includes(i)) bar.classList.add("active");
    
    const barValueText = document.createElement("span");
    barValueText.textContent = val;
    barValueText.className = "bar-value";
    bar.appendChild(barValueText);
    
    barsContainer.appendChild(bar);
  });
}

function record(arr, active) {
  steps.push({ arr: [...arr], active: [...active] });
}

// Sorting Algorithms (No changes needed, they work as intended)
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      record(arr, [j, j + 1]);
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  record(arr, []);
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      record(arr, [j, j + 1]);
      j--;
    }
    arr[j + 1] = key;
    record(arr, [j + 1]);
  }
  record(arr, []);
}

function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      record(arr, [min, j]);
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  record(arr, []);
}

function mergeSort(arr, l=0, r=arr.length-1) {
  if (l >= r) return;
  let m = Math.floor((l+r)/2);
  mergeSort(arr, l, m);
  mergeSort(arr, m+1, r);
  let temp = [];
  let i = l, j = m+1;
  while (i <= m && j <= r) {
    record(arr, [i, j]);
    if (arr[i] < arr[j]) temp.push(arr[i++]);
    else temp.push(arr[j++]);
  }
  while (i <= m) temp.push(arr[i++]);
  while (j <= r) temp.push(arr[j++]);
  for (let k = l; k <= r; k++) arr[k] = temp[k-l];
  record(arr, Array.from({length: r-l+1}, (_, k) => k+l));
}

function quickSort(arr, l=0, r=arr.length-1) {
  if (l >= r) return;
  let pivot = arr[r], i = l;
  for (let j = l; j < r; j++) {
    record(arr, [j, r]);
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[r]] = [arr[r], arr[i]];
  record(arr, [i, r]);
  quickSort(arr, l, i-1);
  quickSort(arr, i+1, r);
}

// Playback functions
function play() {
  if (currentStep >= steps.length) {
    clearInterval(interval);
    return;
  }
  const { arr, active } = steps[currentStep];
  array = arr;
  render(active);
  currentStep++;
}

function startSort() {
  pauseSort();
  steps = [];
  currentStep = 0;
  let arr = [...array];
  let algo = document.getElementById("algo").value;
  if (algo === "bubble") bubbleSort(arr);
  else if (algo === "insertion") insertionSort(arr);
  else if (algo === "selection") selectionSort(arr);
  else if (algo === "merge") mergeSort(arr);
  else if (algo === "quick") quickSort(arr);
  interval = setInterval(play, 1010 - document.getElementById("speed").value);
}

function pauseSort() {
  clearInterval(interval);
}

function stepSort() {
  pauseSort();
  play();
}

function setArray() {
  const input = document.getElementById("userInput").value;
  array = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
  originalArray = [...array];
  steps = [];
  currentStep = 0;
  render();
}

function randomizeArray() {
  array = Array.from({length: 15}, () => Math.floor(Math.random() * 100 - 50));
  document.getElementById("userInput").value = array.join(', ');
  originalArray = [...array];
  steps = [];
  currentStep = 0;
  render();
}

function resetArray() {
  array = [...originalArray];
  steps = [];
  currentStep = 0;
  render();
}

// Initial render
setArray();

