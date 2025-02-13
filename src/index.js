import './index.scss';

var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var stars = 500;
var colorrange = [0, 60, 240];
var starArray = [];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    var y = Math.random() * canvas.offsetHeight;
    var radius = Math.random() * 1.2;
    var hue = colorrange[getRandom(0, colorrange.length - 1)];
    var sat = getRandom(50, 100);
    var opacity = Math.random();
    starArray.push({ x, y, radius, hue, sat, opacity });
}

var frameNumber = 0;
var currentGroup = 0;
var currentOpacity = 1; // Прозрачность текущей группы строк
var nextOpacity = 0;   // Прозрачность следующей группы строк
var fadeSpeed = 0.005; // Скорость угасания/появления текста
var lastGroupDuration = 500; // Длительность показа последней группы строк
var showCongrats = false; // Флаг для показа поздравления

var baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);

function drawStars() {
    for (var i = 0; i < stars; i++) {
        var star = starArray[i];

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 360);
        context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.opacity + ")";
        context.fill();
    }
}

function updateStars() {
    for (var i = 0; i < stars; i++) {
        if (Math.random() > 0.99) {
            starArray[i].opacity = Math.random();
        }
    }
}

function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, index) => {
        context.fillText(line, x, y + index * (fontSize + lineHeight));
    });
}

var poemLines = [
    ["Рядом со мной лежишь", "И не уходишь", "Прочь."],
    ["Выглядишь, как Париж", "В новогоднюю", "Ночь."],
    ["Давай забудем про раны", "И выйдем", "Из темноты."],
    ["Какие на вечность планы?", "У меня,", "Кстати, ты."],
    ["Даже если придут холода", "И убивать", "Станут нас."],
    ["Я буду с тобой не всегда,", "А дольше", "В сто раз."]
];

var congratsLines = [
    "Дорогая Екатерина Юрьевна,",
    "я тону в твоих глазах,",
    "твои нежные губы согревают меня даже в самый холодный день,",
    "",
    '"Этот поезд нас несет стрелою', 
    "До весны сквозь февраль",
    'В фиолетовый рай..."',
    "",
    "Je t'aime, mon soleil ❤️"
];

function drawText() {
    var fontSize = Math.min(30, window.innerWidth / 24);
    var lineHeight = 8;

    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    context.shadowColor = "rgba(128, 0, 128, 0.5)";
    context.shadowBlur = 8;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    // Если поздравление уже показано, отображаем его
    if (showCongrats) {
        context.fillStyle = "rgba(128, 0, 128, 1)";
        drawTextWithLineBreaks(congratsLines, canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        return;
    }

    // Угасание текущей группы строк
    if (currentOpacity > 0) {
        context.fillStyle = `rgba(128, 0, 128, ${currentOpacity})`;
        var lines = poemLines[currentGroup];
        drawTextWithLineBreaks(lines, canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        currentOpacity -= fadeSpeed; // Медленно уменьшаем прозрачность
    }
    // Появление следующей группы строк
    else if (nextOpacity < 1) {
        context.fillStyle = `rgba(128, 0, 128, ${nextOpacity})`;
        var nextLines = poemLines[(currentGroup + 1) % poemLines.length];
        drawTextWithLineBreaks(nextLines, canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        nextOpacity += fadeSpeed; // Медленно увеличиваем прозрачность
    }
    // Переход к следующей группе строк
    else {
        currentGroup = (currentGroup + 1) % poemLines.length; // Переходим к следующей группе
        currentOpacity = 1; // Сбрасываем прозрачность текущей группы
        nextOpacity = 0;    // Сбрасываем прозрачность следующей группы

        // Если это последняя группа строк, ждём дольше
        if (currentGroup === poemLines.length - 1) {
            if (frameNumber >= (poemLines.length * 250) + lastGroupDuration) {
                showCongrats = true; // Показываем поздравление
            }
        }
    }

    // Сброс эффекта тени
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
}

function draw() {
    context.putImageData(baseFrame, 0, 0);

    drawStars();
    updateStars();
    drawText();

    if (frameNumber < 99999) {
        frameNumber++;
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
});

window.requestAnimationFrame(draw);