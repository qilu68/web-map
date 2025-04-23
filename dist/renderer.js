const start = [35.935098, 104.157703];
const end = [36.05, 103.83];

let baseSpeedA = 60 * 1000 / 3600; // m/s
let baseSpeedB = 70 * 1000 / 3600;
let speedMultiplier = 1;

let map, markerA, markerB, polylineA, polylineB;
let pathA = [], pathB = [];

let interval = 100;
let elapsedTimeA = 0;
let elapsedTimeB = 0;
let totalDistance;
let timer = null;

function initMap() {
    map = L.map('map').setView(start, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const iconA = L.divIcon({
        className: 'custom-icon',
        html: '<img src="assets/A.jpg" class="icon-img" />',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    const iconB = L.divIcon({
        className: 'custom-icon',
        html: '<img src="assets/B.jpg" class="icon-img" />',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    markerA = L.marker(start, { icon: iconA }).addTo(map);
    markerB = L.marker(start, { icon: iconB }).addTo(map);

    pathA = [start];
    pathB = [start];

    polylineA = L.polyline(pathA, { color: 'blue' }).addTo(map);
    polylineB = L.polyline(pathB, { color: 'red' }).addTo(map);

    L.marker(start).addTo(map).bindPopup("起点");
    L.marker(end).addTo(map).bindPopup("终点");

    totalDistance = map.distance(start, end);
}

function interpolate(from, to, t) {
    return [
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
    ];
}

function startMoving() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        elapsedTimeA += interval / 1000;
        elapsedTimeB += interval / 1000;

        let distanceA = elapsedTimeA * baseSpeedA * speedMultiplier;
        let distanceB = elapsedTimeB * baseSpeedB * speedMultiplier;

        let tA = Math.min(distanceA / totalDistance, 1);
        let tB = Math.min(distanceB / totalDistance, 1);

        const posA = interpolate(start, end, tA);
        const posB = interpolate(start, end, tB);

        markerA.setLatLng(posA);
        markerB.setLatLng(posB);

        pathA.push(posA);
        pathB.push(posB);

        polylineA.setLatLngs(pathA);
        polylineB.setLatLngs(pathB);

        if (tA >= 1 && tB >= 1) {
            clearInterval(timer);
            timer = null;
            alert("A 和 B 都已到达终点！");
        }
    }, interval);





    additionalCharacters.forEach(char => {
        char.elapsedTime += interval / 1000;
        const distance = char.elapsedTime * char.speed;
        let t = Math.min(distance / totalDistance, 1);
        const pos = interpolate(start, end, t);
        char.marker.setLatLng(pos);
        char.path.push(pos);
        char.polyline.setLatLngs(char.path);
    });




}

// 控制函数
function pause() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function resume() {
    if (!timer) {
        startMoving();
    }
}

function speedUp() {
    speedMultiplier *= 2;
}

function reset() {
    pause();
    elapsedTimeA = 0;
    elapsedTimeB = 0;
    speedMultiplier = 1;

    map.removeLayer(markerA);
    map.removeLayer(markerB);
    map.removeLayer(polylineA);
    map.removeLayer(polylineB);

    markerA = null;
    markerB = null;
    polylineA = null;
    polylineB = null;

    initMap();
    startMoving();



    additionalCharacters.forEach(c => {
        map.removeLayer(c.marker);
        map.removeLayer(c.polyline);
    });
    additionalCharacters.length = 0;



}

// 初始化地图并开始动画
window.onload = () => {
    initMap();
    startMoving();
};











const additionalCharacters = [];

function showAddCharacterDialog() {
    document.getElementById('addCharacterDialog').style.display = 'block';
}

function hideAddCharacterDialog() {
    document.getElementById('addCharacterDialog').style.display = 'none';
}

function addCharacter() {
    const fileInput = document.getElementById('characterImage');
    const speed = parseFloat(document.getElementById('characterSpeed').value) * 1000 / 3600;
    const color = document.getElementById('characterColor').value;

    const file = fileInput.files[0];
    if (!file || isNaN(speed)) {
        alert('请选择头像并输入有效速度');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imgSrc = e.target.result;

        const icon = L.divIcon({
            className: 'custom-icon',
            html: `<img src="${imgSrc}" class="icon-img" />`,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });

        const marker = L.marker(start, { icon }).addTo(map);
        const path = [start];
        const polyline = L.polyline(path, { color }).addTo(map);

        const character = {
            speed,
            marker,
            path,
            polyline,
            elapsedTime: 0
        };

        additionalCharacters.push(character);
    };

    reader.readAsDataURL(file);
    hideAddCharacterDialog();
}




