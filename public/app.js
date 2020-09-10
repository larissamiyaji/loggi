let map, heatmap, marker, i;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: -23.5489, lng: -46.6388 },
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
  const response = await consumirApi(endpoint, Appquery);
  const getPoints = response.data.closestDrivers.drivers.map((item) => {
    if (item.busy === false) {
      return new google.maps.LatLng(item.lat, item.lng);
    }
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints,
    map: map,
  });
  const countAllDrivers = response.data.closestDrivers.driversCount;
  const countReadyDrivers = response.data.closestDrivers.readyDriversCount;
  const countBusyDrivers = response.data.closestDrivers.busyDriversCount;

  const allDrivers = document.getElementById("allDrivers");
  allDrivers.innerHTML = countAllDrivers;
  const busyDrivers = document.getElementById("busyDrivers");
  busyDrivers.innerHTML = countBusyDrivers;
  const readyDrivers = document.getElementById("readyDrivers");
  readyDrivers.innerText = countReadyDrivers;

  setMarkers(map);
  let south = new google.maps.LatLng(-23.5489, -46.6388);
  let east = new google.maps.LatLng(-23.5338, -46.5033);
  let north = new google.maps.LatLng(-23.5719, -46.7008);
  let central = new google.maps.LatLng(-23.5489, -46.6388);
  let west = new google.maps.LatLng(-23.5719, -46.7008);

  let coordenadas = [south, east, north, central, west];
  let flightPath = new google.maps.Polygon({
    path: coordenadas,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0000FF",
    fillOpacity: 0.4,
  });

  flightPath.setMap(map);
}

const region = [
  ["Zona Sul", -23.6542, -46.6592, 4],
  ["Zona Leste", -23.5338, -46.5033, 3],
  ["Zona Oeste", -23.5719, -46.7008, 2],
  ["Zona Norte", -23.4803, -46.6708, 1],
  ["Zona Central", -23.5489, -46.6388, 0],
];
function setMarkers(map) {
  let image = {
    url: "./imagem/delivery-man.png",
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32),
  };

  let shape = {
    coords: [1, 1, 1, 40, 40, 40, 40, 1],
    type: "poly",
  };
  for (let x = 0; x < region.length; x++) {
    let zona = region[x];
    marker = new google.maps.Marker({
      position: { lat: zona[1], lng: zona[2] },
      map: map,
      icon: image,
      shape: shape,
      title: zona[0],
      zIndex: zona[3],
    });
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, i) {
        return function () {
          infowindow.setContent(zona[0]);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }
  let infowindow = new google.maps.InfoWindow();
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
    method: "POST",
    headers: {
      Authorization: `ApiKey larissa.miyaji@gmail.com:690606c72dd744f76826a04630a8a16268ac2560`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
};

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
    "rgba(255, 0, 0, 1)",
  ];
  heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
}

function changeRadius() {
  heatmap.set("radius", heatmap.get("radius") ? null : 20);
}

function changeOpacity() {
  heatmap.set("opacity", heatmap.get("opacity") ? null : 0.2);
}
