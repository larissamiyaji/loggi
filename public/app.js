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

  setMarkers(map);


  /*   markerCenter = new google.maps.Marker({
    position: new google.maps.LatLng( -23.5489, -46.6388 ),
    map: map,
    title: 'Clique Aqui!',
    icon: './imagem/delivery-man.png'
  });
  let infowindow = new google.maps.InfoWindow(), markerCenter;
  
  google.maps.event.addListener(markerCenter, 'click', (function(markerCenter, i) {
    return function() {
      infowindow.setContent("Zona Central");
      infowindow.open(map, markerCenter);
    }
  })(markerCenter)) */
}

const region = [
  ['Zona Sul', -23.6542, -46.6592, 4],
  ['Zona Leste', -23.5338, -46.5033, 3],
  ['Zona Oeste', -23.5719, -46.7008, 2],
  ['Zona Norte', -23.4803, -46.6708, 1],
  ['Zona Central', -23.5489, -46.6388, 0]
]
function setMarkers(map) {
  let image = {
    url: './imagem/delivery-man.png',
    size: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  };

  let shape = {
    coords: [1, 1, 1, 40, 40, 40, 40, 1],
    type: 'poly'
  };
  for (var i = 0; i < region.length; i++) {
    let zona = region[i];
    let marker = new google.maps.Marker({
      position: { lat: zona[1], lng: zona[2] },
      map: map,
      icon: image,
      shape: shape,
      title: zona[0],
      zIndex: zona[3]
    });
  }
}

/* let infowindow = new google.maps.InfoWindow(), markerCenter;
  
  google.maps.event.addListener(markerCenter, 'click', (function(markerCenter, i) {
    return function() {
      for (var i = 0; i < region.length; i++)
      infowindow.setContent(zona[0]);
      infowindow.open(map, markerCenter);
    }
  })(markerCenter)) */

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
