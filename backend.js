// 🌼 Registro de plantas
function registerPlant() {
  const user = document.getElementById('userName').value.trim();
  const plant = document.getElementById('plantName').value.trim();
  const location = document.getElementById('location').value.trim();
  const resultDiv = document.getElementById('registerResult');

  if (!user || !plant || !location) {
    resultDiv.innerText = "❌ Por favor, completa todos los campos.";
    resultDiv.style.color = "red";
    return;
  }

  const plantRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!plantRegex.test(plant)) {
    resultDiv.innerText = "❌ El nombre de la planta solo debe contener letras.";
    resultDiv.style.color = "red";
    return;
  }

  resultDiv.innerText = `✅ ${user} registró la planta "${plant}" en ${location}.`;
  resultDiv.style.color = "green";
}

// 📅 Recomendación de cultivo por mes
function recommendPlanting() {
  const month = new Date().getMonth();
  let recommendation = "";

  if (month >= 2 && month <= 5) {
    recommendation = "🌱 Ideal para iniciar cultivos de flores aromáticas como lavanda y salvia.";
  } else if (month >= 6 && month <= 8) {
    recommendation = "🌻 Buen momento para girasoles, trébol y plantas resistentes al calor.";
  } else {
    recommendation = "🌾 Recomendado preparar el suelo y sembrar especies resistentes al frío.";
  }

  document.getElementById('recommendationResult').innerText = recommendation;
}

// 📚 Consulta de clima por ciudad
function getWeather() {
  const city = document.getElementById('location').value.trim() || 'Zapopan';
  const weatherDiv = document.getElementById('weatherResult');
  weatherDiv.innerText = "Consultando clima...";

  fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error || !data.main) throw new Error();
      weatherDiv.innerText = `🌡️ Temp: ${data.main.temp}°C, Estado: ${data.weather[0].description}`;
    })
    .catch(() => {
      weatherDiv.innerText = "❌ Error al consultar el clima.";
    });
}

// 🧭 Navegación entre páginas
document.addEventListener("DOMContentLoaded", () => {
  const subpageBtn = document.getElementById("subpage-btn");
  const homeBtn = document.getElementById("home-btn");
  const mainContent = document.getElementById("main-content");
  const subpage = document.getElementById("subpage");

  subpageBtn.addEventListener("click", () => {
    mainContent.classList.add("hidden");
    subpage.classList.remove("hidden");
    subpageBtn.classList.add("hidden");
    homeBtn.classList.remove("hidden");
  });

  homeBtn.addEventListener("click", () => {
    subpage.classList.add("hidden");
    mainContent.classList.remove("hidden");
    homeBtn.classList.add("hidden");
    subpageBtn.classList.remove("hidden");
  });

  // 📝 Cuestionario de cultivo con validación regional
  const form = document.getElementById("cultivoForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const region = document.getElementById("region").value.trim().toLowerCase();
      const cultivo = document.getElementById("cultivo").value;
      const fecha = document.getElementById("fecha").value;
      const lat = parseFloat(document.getElementById("latitude")?.value);
      const lng = parseFloat(document.getElementById("longitude")?.value);
      const resultDiv = document.getElementById("recommendationResult");

      if (!region || !cultivo || !fecha) {
        resultDiv.innerText = "⚠️ Completa todos los campos.";
        return;
      }

      const regionesValidas = ["zapopan", "guadalajara", "tlajomulco", "tonalá"];
      const mes = new Date(fecha).getMonth(); // 0 = enero, 11 = diciembre

      let regionEstimada = "🌍 Región no definida";
      if (!isNaN(lat) && !isNaN(lng)) {
        regionEstimada = clasificarRegionPorCoordenadas(lat, lng);
      }

      if (!regionesValidas.includes(region) || mes < 1 || mes > 9) {
        resultDiv.innerText =
          `⚠️ La región o fecha no son óptimas para ${cultivo}.\n📍 Región estimada: ${regionEstimada}\n🌿 Sugerencia: intenta con plantas resistentes como romero, tomillo o suculentas.`;
      } else {
        resultDiv.innerText =
          `📍 Región: ${region}\n🌱 Cultivo: ${cultivo}\n📅 Fecha sugerida: ${fecha}\n📍 Región estimada: ${regionEstimada}`;
      }
    });
  }
});

// 🌎 Clasificación de región por coordenadas
function clasificarRegionPorCoordenadas(lat, lng) {
  if (lat >= 0 && lat <= 20 && lng <= -90) return "México / Centroamérica Pacífico";
  if (lat >= 0 && lat <= 20 && lng > -90) return "Venezuela / Caribe / Colombia norte";
  if (lat < 0 && lat >= -20 && lng <= -90) return "Perú / Bolivia / Chile norte";
  if (lat < 0 && lat >= -20 && lng > -90) return "Brasil / Paraguay / Argentina norte";
  if (lat < -20 && lat >= -55 && lng >= -75 && lng <= -40) return "Argentina sur / Chile sur";
  if (lat >= -10 && lat <= 5 && lng >= -70 && lng <= -50) return "Amazonía (Brasil, Colombia sur)";
  return "🌍 Región no definida";
}

// 🗺️ Mapa Leaflet.js
let map;
let markers = [];

function loadMap() {
  const input = document.getElementById('mapLocation').value.trim();
  const mapDiv = document.getElementById('map');

  if (!input) {
    alert("⚠️ Ingresa una ubicación o coordenadas.");
    return;
  }

  if (mapDiv._leaflet_id) {
    mapDiv._leaflet_id = null;
    mapDiv.innerHTML = '';
    markers = [];
  }

  let lat = 20.6597;
  let lng = -103.3496;

  if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(input)) {
    const parts = input.split(',');
    lat = parseFloat(parts[0]);
    lng = parseFloat(parts[1]);
  }

  map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '🗺️ © OpenStreetMap contributors'
  }).addTo(map);

  addMarker(lat, lng, `📍 Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
}

function addMarker(lat, lng, label = "📍 Punto marcado") {
  if (!map) return;

  const marker = L.marker([lat, lng]).addTo(map)
    .bindPopup(label)
    .openPopup();

  markers.push(marker);
}