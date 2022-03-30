const dataContent = document.querySelector('#data').content.cloneNode(true)

// ====================================sentiment meter

const highestPercentage = document.querySelector(".highest-percentage");
const highestPercentageLabel = document.querySelector(".highest-percentage-label");
const lowestPercentages = document.querySelectorAll(".lowest-percentage");
const lowestPercentagesLabels = document.querySelectorAll(".lowest-percentage-labels");
const positivePercentage = parseFloat(dataContent.querySelector('#positive-percentage').innerText)
const negativePercentage = parseFloat(dataContent.querySelector('#negative-percentage').innerText)
const neutralPercentage = parseFloat(dataContent.querySelector('#neutral-percentage').innerText)
const percentageCurve = document.querySelector("#percentage-curve");
const emoji = document.querySelector('.chart-sec__results__meter__emoji')
const highPercent = Math.max(positivePercentage, negativePercentage, neutralPercentage)
highestPercentage.innerText = `${highPercent}%`
highestPercentageLabel.innerText = setLabelText(highPercent)
emoji.classList.add(setLabelText(highPercent))

const lowPercents = [positivePercentage, negativePercentage, neutralPercentage].filter(p => p !== highPercent)
lowestPercentages.forEach((percent, index) => {
    percent.innerText = `${lowPercents[index]}%`
})
lowestPercentagesLabels.forEach((label, index) => {
    lowPercents.forEach((l, i) => {
        if (i !== index) return
        label.innerText = setLabelText(l)
    })
})

const fullDashArray = 743;
const percentage = (1 - (highPercent / 100)).toFixed(3);
const calcDashOffset = fullDashArray * percentage;
percentageCurve.style.setProperty("--dashOffset", calcDashOffset);

function setLabelText(node) {
    let labelText = ''
    switch (node) {
        case positivePercentage: labelText = 'positive'
            break
        case negativePercentage: labelText = 'negative'
            break
        case neutralPercentage: labelText = 'neutral'
            break
    }
    return labelText
}

// ====================================sentiment charts

// First, include the cdn of chart.js lib
const myCanvas = document.querySelector("#sentiment-chart");
const CANVAS_WIDTH = 860;
const CANVAS_HEIGHT = 495;
myCanvas.width = CANVAS_WIDTH;
myCanvas.height = CANVAS_HEIGHT;

document.addEventListener("DOMContentLoaded", () => {
    if (!myCanvas.getContext) {
        console.log("Your browser doesn't support Canvas element");
        return;
    }
});

const ctx = myCanvas.getContext("2d");
const totalReviews = parseFloat(dataContent.querySelector('#total-reviews').innerText)
const positiveReviews = [...dataContent.querySelectorAll('#positive-reviews')[0].children]
const negativeReviews = [...dataContent.querySelectorAll('#negative-reviews')[0].children]
const neutralReviews = [...dataContent.querySelectorAll('#neutral-reviews')[0].children]
const labels = Array.from({ length: totalReviews }, (_, i) => i + 1)


const data = {
    labels,
    datasets: [
        {
            label: "Positive",
            data: positiveReviews.map(li => parseFloat(li.innerText)),
            fill: true,
            backgroundColor: getGradient(
                CANVAS_WIDTH,
                CANVAS_HEIGHT,
                "rgba(23 109  207 / .5)",
                "rgba(232 246 252 / 0)"
            ),
            borderColor: "#176DCF",
            borderWidth: 2,
        },

        {
            label: "Neutral",
            data: neutralReviews.map(li => parseFloat(li.innerText)),
            fill: true,
            backgroundColor: getGradient(
                CANVAS_WIDTH,
                CANVAS_HEIGHT,
                "rgba(73 120 162 / .8)",
                "rgba(239 244 246 / 0)"
            ),
            borderColor: "#4978A2",
            borderWidth: 2,
        },
        {
            label: "Negative",
            data: negativeReviews.map(li => parseFloat(li.innerText)),
            fill: true,
            backgroundColor: getGradient(
                CANVAS_WIDTH,
                CANVAS_HEIGHT,
                "rgba(218 16 97 / 1)",
                "rgba(254 231 241 / 0)"
            ),
            borderColor: "#DA1061",
            borderWidth: 2,
        }
    ]
};

const config = {
    type: "line",
    data,
    options: {
        lineTension: 0.5,
        interaction: {
            mode: "index",
            intersect: false
        },
        scales: {
            x: {
                ticks: {
                    color: "#A9C1D1"
                },
                grid: {
                    color: "#E8F6FC",
                    drawBorder: false,
                }
            },
            y: {
                min: 0,
                max: 80,
                ticks: {
                    color: "#A9C1D1"
                },
                grid: {
                    color: "#E8F6FC",
                    drawBorder: false,
                }
            }
        }
    }
};

const myChart = new Chart(myCanvas, config);

function getGradient(canvasWidth, canvasHeight, ...colors) {
    const offsetHeight = canvasHeight / 3;
    // const offsetHeight = 0;
    const gradient = ctx.createLinearGradient(
        canvasWidth / 2,
        0,
        canvasWidth / 2,
        canvasHeight + offsetHeight
    );
    colors.forEach((clr, index) => {
        if (index === 0) {
            gradient.addColorStop((1 / colors.length) * index, clr);
            return;
        }
        gradient.addColorStop((1 / colors.length) * (index + 1), clr);
    });

    return gradient;
}