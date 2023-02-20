const handle = document.querySelectorAll(".handle");
const slider = document.querySelectorAll(".slider");
const sliderStatus = document.querySelectorAll(".slider-status");
const wrapperSlider = document.querySelector(".wrapper-slider");
const radioSelect = document.querySelectorAll(".radio-select");
const canvas = document.getElementById("chart");
const context = canvas.getContext("2d");
let isDragging = false;
let sliderPosition = 0;
let storageGB = 0;
let transferGB = 0;
let typeDisc = "HDD";
let countThurd = "Multi";

let currentHandler = handle[0];
let currentSlider = slider[0];
let currentSliderStatus = sliderStatus[0];

// Set up initial chart data and draw chart
let chartData = [
  { label: "Backblaze", value: 0, color: "#FF5733" },
  { label: "Bunny", value: 0, color: "#f0ae07" },
  { label: "ScaleWay", value: 0, color: "#a00fd1" },
  { label: "Vultr", value: 0, color: "#1aa2eb" },
];

// Set up chart settings and draw chart
function drawChart(chartData) {
  const barWidth = 50;
  const chartPadding = 20;
  const chartTopPadding = 50;
  const maxValue = Math.max(...chartData.map((data) => data.value));
  const chartHeight = canvas.height - chartTopPadding - chartPadding;
  const chartWidth = canvas.width - chartPadding * 2;
  const barSpacing = (chartWidth - barWidth * chartData.length) / (chartData.length - 1);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#333";
  context.font = "14px Arial";
  context.textAlign = "center";
  chartData.forEach((data, i) => {
    const barHeight = chartHeight * (data.value / maxValue);
    const x = chartPadding + i * (barWidth + barSpacing);
    const y = canvas.height - chartPadding - barHeight;
    context.fillStyle = data.color;
    context.fillRect(x, y, barWidth, barHeight);
    context.fillStyle = "#333";
    context.fillText(data.label, x + barWidth / 2, canvas.height - chartPadding / 2);
  });

  context.beginPath();
  context.moveTo(chartPadding, chartTopPadding);
  context.lineTo(chartPadding, canvas.height - chartPadding);
  context.lineTo(canvas.width - chartPadding, canvas.height - chartPadding);
  context.strokeStyle = "#333";
  context.stroke();
  context.font = "16px Arial";
  context.fillText("Value", chartPadding / 2, chartTopPadding / 2);
  context.save();
  context.translate(chartPadding / 2, chartTopPadding + chartHeight / 2);
  context.rotate(-Math.PI / 2);
  context.textAlign = "center";
  context.fillText("Fruit", 0, 0);
  context.restore();
}

const backblazeCalc = (storage, transfer) => {
  return storage * 0.005 + transfer * 0.01 <= 7 ? 7 : storage * 0.005 + transfer * 0.01;
};
const bunnyCalc = (storage, transfer, typeDisc) => {
  const checkMaxValue = (condition) => (condition >= 10 ? 10 : condition);

  if (typeDisc === "HDD") {
    return checkMaxValue(storage * 0.01 + transfer * 0.01);
  } else {
    return checkMaxValue(storage * 0.02 + transfer * 0.01);
  }
};
const scaleWayCalc = (storage, transfer, countThurd) => {
  if (countThurd === "Multi") {
    return (storage <= 75 ? 0 : (storage - 75) * 0.06) + (transfer <= 75 ? 0 : (transfer - 75) * 0.02);
  } else {
    return (storage <= 75 ? 0 : (storage - 75) * 0.03) + (transfer <= 75 ? 0 : (transfer - 75) * 0.02);
  }
};
const vultCalc = (storage, transfer) => {
  return (storage + transfer) * 0.01 <= 5 ? 5 : (storage + transfer) * 0.01;
};

drawChart(chartData);

const changeChartDataFun = () => {
  return chartData.map((item) => {
    if (item.label === "Backblaze") {
      return { ...item, value: backblazeCalc(storageGB, transferGB) };
    } else if (item.label === "Bunny") {
      return { ...item, value: bunnyCalc(storageGB, transferGB, typeDisc) };
    } else if (item.label === "ScaleWay") {
      return { ...item, value: scaleWayCalc(storageGB, transferGB, countThurd) };
    } else if (item.label === "Vultr") {
      return { ...item, value: vultCalc(storageGB, transferGB) };
    }
  });
};

wrapperSlider.addEventListener("mousedown", (e) => {
  if (e.target.closest(".storage")) {
    currentHandler = handle[0];
    currentSlider = slider[0];
    currentSliderStatus = sliderStatus[0];
  } else {
    currentHandler = handle[1];
    currentSlider = slider[1];
    currentSliderStatus = sliderStatus[1];
  }
});
document.addEventListener("mousemove", (e) => {
  currentHandler &&
    currentHandler.addEventListener("mousedown", () => {
      isDragging = true;
    });
  if (isDragging && currentSlider) {
    let position = e.pageX - currentSlider.offsetLeft;
    if (position < 0) {
      position = 0;
    } else if (position > currentSlider.offsetWidth) {
      position = currentSlider.offsetWidth;
    }
    currentHandler.style.left = position + "px";
    sliderPosition = Math.ceil((position / currentSlider.offsetWidth) * 1000);
    currentSliderStatus.textContent = sliderPosition;

    currentSlider.closest(".storage") ? (storageGB = sliderPosition) : (transferGB = sliderPosition);

    // Clear the canvas and redraw the chart with the updated data
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawChart(changeChartDataFun());
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

radioSelect.forEach((radio) => {
  radio.addEventListener("click", (e) => {
    e.target.value === "HDD" || e.target.value === "SSD" ? (typeDisc = e.target.value) : (countThurd = e.target.value);
    drawChart(changeChartDataFun());
  });
});

function drawChart(chartData) {
  const barWidth = 50;
  const chartPadding = 20;
  const chartTopPadding = 50;
  const maxValue = 100;
  const chartHeight = canvas.height - chartTopPadding - chartPadding;
  const chartWidth = canvas.width - chartPadding * 2;
  const barSpacing = (chartWidth - barWidth * chartData.length) / (chartData.length - 1);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#333";
  context.font = "14px Arial";
  context.textAlign = "center";
  chartData.forEach((data, i) => {
    const barHeight = chartHeight * (data.value / maxValue);
    const x = chartPadding + i * (barWidth + barSpacing);
    const y = canvas.height - chartPadding - barHeight;
    context.fillStyle = data.color;
    context.fillRect(x, y, barWidth, barHeight);
    context.fillStyle = "#333";
    context.fillText(data.label, x + barWidth / 2, canvas.height - chartPadding / 2);
    context.fillText(data.value, x + barWidth / 2, y - 10); // Display the value above the bar
  });

  context.beginPath();
  context.moveTo(chartPadding, chartTopPadding);
  context.lineTo(chartPadding, canvas.height - chartPadding);
  context.lineTo(canvas.width - chartPadding, canvas.height - chartPadding);
  context.strokeStyle = "#333";
  context.stroke();
  context.font = "16px Arial";
  context.fillText("Value", chartPadding / 2, chartTopPadding / 2);
  context.save();
  context.translate(chartPadding / 2, chartTopPadding + chartHeight / 2);
  context.rotate(-Math.PI / 2);
  context.textAlign = "center";
  context.fillText("$", 0, 0);
  context.restore();
}
