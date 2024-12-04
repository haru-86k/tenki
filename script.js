// グローバル変数で性別を管理
let selectedGender = 'male'; // デフォルトは男性

// 性別選択時に呼び出す関数
function setGender(gender) {
    selectedGender = gender; // 選択された性別を設定
    getWeather(); // 最新の天気データで再表示
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

        // 服装アドバイスを更新
        const clothingAdviceElement = document.getElementById('clothing-advice');
        const mainTemperature = temperatures[0];
        const mainWeatherCode = weatherCodes[0];
        const advice = getClothingAdviceForCityAndGender(selectedCity, mainTemperature, mainWeatherCode);
        clothingAdviceElement.textContent = advice;

        // 背景画像の設定
        setBackgroundImage(mainWeatherCode);
    } else {
        alert("天気データを取得できませんでした。");
    }
}

// 性別と都市に応じた服装アドバイスを取得する関数
function getClothingAdviceForCityAndGender(city, temperature, weatherCode) {
    let advice = "";

    if (selectedGender === "male") {
        // 男性向けアドバイス
        if (temperature >= 30) advice = "男性: 暑いのでTシャツとショートパンツが最適です。";
        else if (temperature >= 20) advice = "男性: 薄手のシャツや長袖Tシャツが快適です。";
        else if (temperature >= 10) advice = "男性: 軽いジャケットを着用してください。";
        else advice = "男性: 厚手のコートを着用してください。";
    } else {
        // 女性向けアドバイス
        if (temperature >= 30) advice = "女性: 暑いのでワンピースや軽装が良いでしょう。";
        else if (temperature >= 20) advice = "女性: 薄手のブラウスやカーディガンが適しています。";
        else if (temperature >= 10) advice = "女性: 軽いジャケットやセーターをお勧めします。";
        else advice = "女性: コートやマフラーを準備してください。";
    }

    return advice;
}

// 背景画像の設定
function setBackgroundImage(weatherCode) {
    let backgroundImage = '';
    switch (weatherCode) {
        case 0: case 1:
            backgroundImage = 'url("sunny.jpg")'; // 天気が晴れのとき
            break;
        case 2:
            backgroundImage = 'url("cloudy.jpg")'; // 曇りのとき
            break;
        case 3:
            backgroundImage = 'url("rainy.jpg")'; // 雨のとき
            break;
        default:
            backgroundImage = 'url("sunny.jpg")'; // 不明な天気コードの場合も晴れの背景にする
            break;
    }

    // 背景画像を body に設定
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = "cover"; // 画像が画面いっぱいに表示されるようにする
    document.body.style.backgroundPosition = "center"; // 背景画像の表示位置を中央にする
    document.body.style.backgroundAttachment = "fixed"; // スクロール時に背景が固定されるようにする
}

// ページが読み込まれた時の初期動作
window.onload = function () {
    getWeather();
};

async function uploadClothingPhoto() {
    const clothingType = document.getElementById('clothing-type').value;
    const minTemp = document.getElementById('min-temp').value;
    const maxTemp = document.getElementById('max-temp').value;
    const photo = document.getElementById('clothing-photo').files[0];

    if (!photo) {
        alert("写真を選択してください。");
        return;
    }

    const formData = new FormData();
    formData.append('file', photo);
    formData.append('clothingType', clothingType);
    formData.append('minTemp', minTemp);
    formData.append('maxTemp', maxTemp);

    try {
        const response = await fetch('/api/photos/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const message = await response.text();
            alert(message);
        } else {
            const error = await response.text();
            alert("エラー: " + error);
        }
    } catch (error) {
        console.error("写真アップロード中にエラーが発生しました:", error);
        alert("サーバーに接続できませんでした。");
    }
}

// 画像を表示する関数
function displayImage(event) {
    const file = event.target.files[0];  // 選択されたファイルを取得

    if (file) {
        const reader = new FileReader();  // ファイルリーダーを使って画像を読み込む
        
        reader.onload = function(e) {
            const imageUrl = e.target.result;  // 読み込まれた画像のURLを取得
            const clothingImage = document.getElementById("clothing-image");

            clothingImage.src = imageUrl;  // 画像のsrc属性を更新
            clothingImage.style.display = "block";  // 画像を表示
        };

        reader.readAsDataURL(file);  // ファイルをDataURLとして読み込む
    } else {
        alert("画像ファイルが選択されていません。");
    }
}
