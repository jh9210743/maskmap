var map = L.map("map", {
  center: [22.604964, 120.300476],
  zoom: 16
})
let userPosition
const icon = {
  redIcon: new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  greenIcon: new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  orangeIcon: new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  greyIcon: new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

function getRawData() {
  return axios
    .get(
      "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR17_yFHM9x1Sq_us2j-cI3fRkyx9j7XiVibo2pqHY-Nl4uiW-esxRejZVc"
    )
    .then(({ data: { features } }) => {
      return features
    })
}

async function renderHandler() {
  const rawData = await getRawData()
  const calculateData = addAttr(rawData)
  renderMapInfo(calculateData)
  renderSidebarInfo(calculateData)
}
function addAttr(data) {
  const calculateInfoAll = data.map(el => {
    let calculateInfo = {
      properties: el.properties,
      geoinfo: el.geometry.coordinates,
      distance: (
        map.distance(
          userPosition,
          new L.LatLng(el.geometry.coordinates[1], el.geometry.coordinates[0])
        ) / 1000
      ).toFixed(1)
    }
    switch (true) {
      case el.properties.mask_adult > 80:
        calculateInfo.properties.mask_adult_storage = "full"
        break
      case 80 > el.properties.mask_adult && el.properties.mask_adult > 0:
        calculateInfo.properties.mask_adult_storage = "few"
        break
      case el.properties.mask_adult === 0:
        calculateInfo.properties.mask_adult_storage = "none"
        break
      default:
        calculateInfo.properties.mask_adult_storage = "none"
        break
    }
    switch (true) {
      case el.properties.mask_child > 80:
        calculateInfo.properties.mask_child_storage = "full"
        break
      case 80 > el.properties.mask_child && el.properties.mask_child > 0:
        calculateInfo.properties.mask_child_storage = "few"
        break
      case el.properties.mask_child === 0:
        calculateInfo.properties.mask_child_storage = "none"
        break
      default:
        calculateInfo.properties.mask_child_storage = "none"
        break
    }
    return calculateInfo
  })
  return calculateInfoAll
}

function renderMapInfo(data) {
  var markers = new L.MarkerClusterGroup().addTo(map)
  for (var i = 0; data.length > i; i++) {
    markers.addLayer(
      L.marker([data[i].geoinfo[1], data[i].geoinfo[0]], {
        get icon() {
          switch (true) {
            case data[i].properties.mask_adult > 80:
              return icon.greenIcon
            case 80 > data[i].properties.mask_adult &&
              data[i].properties.mask_adult > 0:
              return icon.orangeIcon
            case data[i].properties.mask_adult === 0:
              return icon.greyIcon
            default:
              return icon.greyIcon
          }
        }
      }).bindPopup(
        `<div class='popcontent'>
            <div class='masknum-adult s-${data[i].properties.mask_adult_storage}'>${data[i].properties.mask_adult}</div>
            <div class='masknum-child s-${data[i].properties.mask_child_storage}'>${data[i].properties.mask_child}</div>
        </div>
        `
      )
    )
  }
  map.addLayer(markers)
}

function renderSidebarInfo(data) {
  let renderContent = ""
  console.log("123", data)
  const filterData = data.filter(el => el.properties.mask_adult > 150)
  filterData.forEach(el => {
    renderContent += `<li>
        <div class="storage">
            <div class="adult ${el.properties.mask_adult_storage}">
                <div class="item">成人口罩數量</div>
                <div class="num">${el.properties.mask_adult}片</div>
            </div>
            <div class="child ${el.properties.mask_child_storage}">
                <div class="item">兒童口罩數量</div>
                <div class="num">${el.properties.mask_child}片</div>
            </div>
        </div>
        <div class="title" data-time="open">
            <div class="name">${el.properties.name}</div>
            <div class="distance">${el.distance}km</div>
            <div class="status">營業中</div>
        </div>
        <div class="detail">
            <span>地址 ${el.properties.address}</span>
            <a href="" class="outlink">於地圖查看</a>
        </div>
        <div class="phone">
            <span>電話 ${el.properties.phone}</span>
            <a href="" class="outlink">撥打電話</a>
        </div>
    </li>
    `
  })
  const ul = document.getElementById("medinfo")
  ul.innerHTML = renderContent
}
function setUserPosition() {
  navigator.geolocation.getCurrentPosition(function(location) {
    userPosition = new L.LatLng(
      location.coords.latitude,
      location.coords.longitude
    )
    L.marker(userPosition, { icon: icon.redIcon }).addTo(map)
    map.panTo(userPosition)
  })
}
setUserPosition()
renderHandler()
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
