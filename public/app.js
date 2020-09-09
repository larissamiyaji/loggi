let map, heatmap;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: -23.5489, lng: -46.6388 },
    mapTypeId: "satellite"
  });
  const response = await consumirApi(endpoint, Appquery)
  const getPoints = response.data.closestDrivers.drivers.map((item) => {
    if (item.busy === false) {
      return new google.maps.LatLng(item.lat, item.lng)
    }
  })
  
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints,
    map: map
  });
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}
const endpoint = `https://www.loggi.com/graphql`;

const Appquery = `
query AppQuery {
  closestDrivers(productType: 2, transportType: "1", lat: -23.55, lng: -46.63, radius: 10.0, limit: 200, citySlug:"sp") {
    driversCount
    readyDriversCount
    busyDriversCount
    drivers {
      lng
      lat
      busy
    }
  }
}`;

const consumirApi = async (endpoint, query, variables = {}) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `ApiKey larissa.miyaji@gmail.com:690606c72dd744f76826a04630a8a16268ac2560`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
}
  
function changeGradient() {
  const gradient = [
    "rgba(0, 255, 255, 0)",
    "rgba(0, 255, 255, 1)",
    "rgba(0, 191, 255, 1)",
    "rgba(0, 127, 255, 1)",
    "rgba(0, 63, 255, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(0, 0, 223, 1)",
    "rgba(0, 0, 191, 1)",
    "rgba(0, 0, 159, 1)",
    "rgba(0, 0, 127, 1)",
    "rgba(63, 0, 91, 1)",
    "rgba(127, 0, 63, 1)",
    "rgba(191, 0, 31, 1)",
    "rgba(255, 0, 0, 1)"
  ];
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}
