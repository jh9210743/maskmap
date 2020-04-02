// 設定map變數為leaflet物件
var map = L.map("map", {
  center: [22.604964, 120.300476],
  zoom: 15
})

// 地圖marker
let markers

// 使用者當前位置容器
let userPosition = new L.LatLng(22.604964, 120.300476)

// 使用者設定距離
let distance

// 使用者當前位置
let positionMarker

// 取得的資料與計算資料
let rawData
let calculateData
let filterdistancedata
let filtermasktypedata

// 要使用的icon內容設定
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

function LoadingtoggleHandler(status) {
  if (status === "load") {
    console.log("load")
    document.querySelector(".backgray").classList.remove("d-none")
  } else {
    console.log("done")
    document.querySelector(".backgray").classList.add("d-none")
  }
}

// 獲取原始資料
function getRawData() {
  return axios
    .get(
      "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR17_yFHM9x1Sq_us2j-cI3fRkyx9j7XiVibo2pqHY-Nl4uiW-esxRejZVc"
    )
    .then(({ data: { features } }) => {
      // console.log(features)
      return features
    })
}

// 畫面更新主函式
async function renderHandler() {
  rawData = await getRawData()
  calculateData = addAttr(rawData)
  filterdistancedata = setDistance(calculateData)
  filtermasktypedata = setMasktype(filterdistancedata)
  renderMapInfo(filtermasktypedata)
  renderSidebarHeadInfo(filtermasktypedata)
  renderSidebarMedInfo(filtermasktypedata)
  LoadingtoggleHandler("done")
  //   document.getElementById("refreshbtn").addEventListener("click", refresh)
}

// 新增需要用到的屬性並回傳新的格式資料
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

// 渲染地圖層資訊
function renderMapInfo(data) {
  // var markers = new L.MarkerClusterGroup().addTo(map);
  if (markers) {
    map.removeLayer(markers)
  }
  markers = new L.MarkerClusterGroup().addTo(map)
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
        `
        <div class="popup">
          <div class="poptitle">
            <div class="name">${data[i].properties.name}</div>
            <span class="titleinfo">${data[i].properties.phone}</span>
            <span class="titleinfo">
              <a target="blank" href="https://www.google.com/maps/dir/?api=1&destination=${data[i].geoinfo[1]},${data[i].geoinfo[0]}">
              ${data[i].properties.address}
              </a>
            </span>
          </div>
          <div class='popcontent'>
            <span>成人</span><div class='masknum-adult s-${data[i].properties.mask_adult_storage}'>${data[i].properties.mask_adult}</div>
            <span>兒童</span><div class='masknum-child s-${data[i].properties.mask_child_storage}'>${data[i].properties.mask_child}</div>
          </div>
        </div>
        `
      )
    )
  }
  map.addLayer(markers)
}
function renderSidebarHeadInfo(data) {
  // 奇偶數天計算
  const daydom = document.querySelector(".daytype")
  const daytype = function() {
    if (moment().days() === 7) {
      return "全部"
    } else {
      return ["偶數", "奇數"][moment().days() % 2]
    }
  }
  // 資料更新時間
  const timedom = document.getElementById("updatetime")
  let time
  data.some(el => {
    if (el.properties.updated) {
      time = el.properties.updated
      return true
    } else {
      return false
    }
  })

  daydom.innerHTML = daytype()
  timedom.innerHTML = `資訊更新時間: ${time}`
}

// render 側邊攔藥局資訊
function renderSidebarMedInfo(data) {
  const ul = document.getElementById("medinfo")
  let renderContent = ""
  data.forEach(el => {
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
        </div>
        <div class="detail">
            <span>地址 ${el.properties.address}</span>
            <a target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${el.geoinfo[1]},${el.geoinfo[0]}" class="outlink">於地圖查看</a>
        </div>
        <div class="phone">
            <span>電話 ${el.properties.phone}</span>
            <a href="tel:${el.properties.phone}" class="outlink">撥打電話</a>
        </div>
    </li>
    `
  })
  const noresult = `<li class="alert-message">
            <div class="message-content"> 
                <span>很抱歉，您設定的條件無法找到結果，請重新設定</span>
            </div>
        </li>`
  ul.innerHTML = renderContent || noresult
}

function setUserPosition() {
  navigator.geolocation.getCurrentPosition(function(location) {
    userPosition = new L.LatLng(
      location.coords.latitude,
      location.coords.longitude
    )
    if (positionMarker) {
      map.removeLayer(positionMarker)
      positionMarker = L.marker(userPosition, { icon: icon.redIcon })
      positionMarker.addTo(map)
    } else {
      positionMarker = L.marker(userPosition, { icon: icon.redIcon })
      positionMarker.addTo(map)
    }
    map.panTo(userPosition)
  })
}

// 刷新頁面
// function refresh() {
//   console.log("refresh")
//   setUserPosition()
//   filterdistancedata = setDistance(calculateData)
//   filtermasktypedata = setMasktype(filterdistancedata)
//   renderSidebarMedInfo(filtermasktypedata)
//   // 會讓地圖render變慢
// }

// 改變設定條件後的樣式
function optionstylechange(dom, domlist) {
  for (i = 0; i < domlist.length; i++) {
    domlist[i].classList.remove("active")
  }
  dom.classList.add("active")
}

// 設定要抓取的距離
function setDistance(data, distance = 5) {
  if (distance !== "all") {
    return data.filter(el => el.distance < parseInt(distance))
  } else {
    return data
  }
}
// 幫距離選項加上監聽事件
function distanceHandler() {
  const optionList = document.querySelectorAll(".distance-option")
  for (let i = 0; i < optionList.length; i++) {
    optionList[i].addEventListener("click", function() {
      filterdistancedata = setDistance(
        calculateData,
        optionList[i].dataset.distance
      )
      renderSidebarMedInfo(filterdistancedata)
      renderMapInfo(filterdistancedata)
      optionstylechange(optionList[i], optionList)
    })
  }
}

// 設定要抓取的口罩種類
function setMasktype(data, masktype = "all") {
  // console.log(data)
  if (masktype !== "all") {
    if (masktype === "adult") {
      return data.filter(el => el.properties.mask_adult > 0)
    } else {
      return data.filter(el => el.properties.mask_child > 0)
    }
  } else {
    return data
  }
}
// 幫口罩類型選項加上監聽事件
function masktypeHandler() {
  const optionList = document.querySelectorAll(".masktype-option")

  for (let i = 0; i < optionList.length; i++) {
    optionList[i].addEventListener("click", function() {
      const filtermasktypedata = setMasktype(
        filterdistancedata,
        optionList[i].dataset.masktype
      )
      renderSidebarMedInfo(filtermasktypedata)
      renderMapInfo(filtermasktypedata)
      optionstylechange(optionList[i], optionList)
    })
  }
}
// 回傳地址或名稱有相符字串的資料
function search(data, serachInput = "") {
  return data.filter(el => {
    return (
      el.properties.name.indexOf(serachInput) !== -1 ||
      el.properties.address.indexOf(serachInput) !== -1
    )
  })
}
// 搜尋加上監聽事件
function searchHandler() {
  const searchInput = document.getElementById("searchinput")
  document.getElementById("search").addEventListener("click", () => {
    const searchdata = search(filtermasktypedata, searchInput.value)
    renderSidebarMedInfo(searchdata)
    renderMapInfo(searchdata)
  })
}
// 說明圖片加上監聽事件
function explainHandler() {
  const expbtn = document.getElementById("explainbtn")
  const closebtn = document.querySelector(".close")
  expbtn.addEventListener("click", e => {
    e.preventDefault()
    document.getElementById("explain").classList.remove("d-none")
  })
  closebtn.addEventListener("click", e => {
    document.getElementById("explain").classList.add("d-none")
  })
}

// 新增地圖圖層
function addMapLayer() {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
}

;(function startUp() {
  setUserPosition()
  renderHandler()
  distanceHandler()
  masktypeHandler()
  searchHandler()
  explainHandler()
  addMapLayer()
})()
