// 天気データを取得する関数
async function getWeather() {
    const citySelect = document.getElementById('city');
    const [latitude, longitude] = citySelect.value.split(',');

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weathercode&timezone=Asia/Tokyo`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.hourly) {
        const hours = data.hourly.time.slice(0, 6);
        const temperatures = data.hourly.temperature_2m.slice(0, 6);
        const precipitationProbabilities = data.hourly.precipitation_probability.slice(0, 6);
        const weatherCodes = data.hourly.weathercode.slice(0, 6);

        const weatherCodeToDescription = (code) => {
            switch (code) {
                case 0: return '晴れ';
                case 1: return '主に晴れ';
                case 2: return '曇り';
                case 3: return '雨';
                case 45: return '霧';
                case 51: return '小雨';
                default: return '不明';
            }
        };

        // 天気予報テーブルの更新
        const weatherRow = document.querySelector('#weather-table tbody');
        weatherRow.innerHTML = '';
        for (let i = 0; i < hours.length; i++) {
            weatherRow.innerHTML += `
                <tr>
                    <td>${hours[i]}</td>
                    <td>${weatherCodeToDescription(weatherCodes[i])}</td>
                    <td>${temperatures[i]}°C</td>
                    <td>${precipitationProbabilities[i]}%</td>
                </tr>
            `;
        }

        // 服装アドバイスの更新
        const clothingAdviceElement = document.getElementById('clothing-advice');
        const mainTemperature = temperatures[0];
        const mainWeatherCode = weatherCodes[0];
        const advice = getClothingAdvice(mainTemperature, mainWeatherCode);
        clothingAdviceElement.textContent = advice;

        // 天気コードに応じて背景画像を設定
        setBackgroundImage(mainWeatherCode);
    } else {
        alert("天気データを取得できませんでした。");
    }
}

// 服装アドバイスを取得する関数
function getClothingAdvice(temperature, weatherCode) {
    let advice = "";
    switch (weatherCode) {
        case 0:
        case 1:
            if (temperature >= 30) advice = "暑いので、Tシャツやショートパンツが適しています。";
            else if (temperature >= 20) advice = "薄手のシャツや長袖Tシャツで快適です。";
            else if (temperature >= 10) advice = "軽いジャケットやセーターが必要です。";
            else advice = "寒いので、厚手のコートを着てください。";
            break;
        case 2:
            advice = "曇りの日は気温に合わせて調整が必要です。軽めの上着を持ちましょう。";
            break;
        case 3:
            advice = "雨が降るため、防水ジャケットや傘が必要です。";
            break;
        default:
            advice = "不明な天気ですが、調整できる服装がおすすめです。";
    }
    return advice;
}

// 背景画像の設定
function setBackgroundImage(weatherCode) {
    let backgroundImage = '';
    switch (weatherCode) {
        case 0: case 1: backgroundImage = 'url("sunny.jpg")'; break;
        case 2: backgroundImage = 'url("cloudy.jpg")'; break;
        case 3: backgroundImage = 'url("rainy.jpg")'; break;
        default: backgroundImage = 'url("default.jpg")';
    }
    document.body.style.backgroundImage = backgroundImage;
}

// ページが読み込まれた時の初期動作
window.onload = function() {
    getWeather();
};

// 都市に合わせた服装アドバイスを取得する関数
function getClothingAdviceForCity(city, temperature, weatherCode) {
    let advice = "";
    switch (city) {
        case '東京':
        case '大阪':
        case '名古屋':
        case '京都':
            advice = getClothingAdvice(temperature, weatherCode);
            break;
        case '札幌':
        case '仙台':
            if (temperature <= 10) {
                advice = "寒いので、厚手のコートを着てください。";
            } else {
                advice = "軽いジャケットを着ると良いでしょう。";
            }
            break;
        case '福岡':
        case '広島':
            if (temperature >= 25) {
                advice = "暑いので、軽装で過ごすのが良いでしょう。";
            } else {
                advice = "少し肌寒いので、薄手のジャケットを持っていくと便利です。";
            }
            break;
        default:
            advice = "都市が不明ですが、調整できる服装を選んでください。";
            break;
    }
    return advice;
}

// 天気データを取得する関数
async function getWeather() {
    const citySelect = document.getElementById('city');
    const selectedCity = citySelect.options[citySelect.selectedIndex].text;
    const [latitude, longitude] = citySelect.value.split(',');

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weathercode&timezone=Asia/Tokyo`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.hourly) {
        const hours = data.hourly.time.slice(0, 6);
        const temperatures = data.hourly.temperature_2m.slice(0, 6);
        const precipitationProbabilities = data.hourly.precipitation_probability.slice(0, 6);
        const weatherCodes = data.hourly.weathercode.slice(0, 6);

        const weatherCodeToDescription = (code) => {
            switch (code) {
                case 0: return '晴れ';
                case 1: return '主に晴れ';
                case 2: return '曇り';
                case 3: return '雨';
                case 45: return '霧';
                case 51: return '小雨';
                default: return '不明';
            }
        };

        // 天気予報テーブルの更新
        const weatherRow = document.querySelector('#weather-table tbody');
        weatherRow.innerHTML = '';
        for (let i = 0; i < hours.length; i++) {
            weatherRow.innerHTML += `
                <tr>
                    <td>${hours[i]}</td>
                    <td>${weatherCodeToDescription(weatherCodes[i])}</td>
                    <td>${temperatures[i]}°C</td>
                    <td>${precipitationProbabilities[i]}%</td>
                </tr>
            `;
        }

        // 服装アドバイスの更新（都市名に基づく）
        const clothingAdviceElement = document.getElementById('clothing-advice');
        const mainTemperature = temperatures[0];
        const mainWeatherCode = weatherCodes[0];
        const advice = getClothingAdviceForCity(selectedCity, mainTemperature, mainWeatherCode);
        clothingAdviceElement.textContent = advice;

        // 背景画像の設定
        setBackgroundImage(mainWeatherCode);
    } else {
        alert("天気データを取得できませんでした。");
    }

    function getClothingAdviceForCityAndGender(city, temperature, weatherCode) {
        let advice = "";
        if (selectedGender === "male") {
            if (temperature >= 30) advice = "男性：暑いのでTシャツとショートパンツが最適です。";
            else if (temperature >= 20) advice = "男性：薄手のシャツや長袖Tシャツが快適です。";
            else if (temperature >= 10) advice = "男性：軽いジャケットを着用してください。";
            else advice = "男性：厚手のコートを着用してください。";
        } else {
            if (temperature >= 30) advice = "女性：暑いのでワンピースや軽装が良いでしょう。";
            else if (temperature >= 20) advice = "女性：薄手のブラウスやカーディガンが適しています。";
            else if (temperature >= 10) advice = "女性：軽いジャケットやセーターをお勧めします。";
            else advice = "女性：コートやマフラーを準備してください。";
        }
        return advice;

    }
    
}
