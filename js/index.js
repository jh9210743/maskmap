var map = L.map('map', {
    center: [22.604964, 120.300476],
    zoom: 16
});

const icon = {
    greenIcon: new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    redIcon: new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    greyIcon: new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
};
async function mapHandler() {
    try {
        // 獲取API資料並回傳加上庫存狀況的資料
        await axios
            .get(
                'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR17_yFHM9x1Sq_us2j-cI3fRkyx9j7XiVibo2pqHY-Nl4uiW-esxRejZVc'
            )
            .then(({ data: { features } }) => {
                const calculateInfoAll = features.map(el => {
                    let calculateInfo = { properties: el.properties, geoinfo: el.geometry.coordinates };
                    switch (true) {
                        case el.properties.mask_adult > 80:
                            calculateInfo.properties.mask_adult_storage = 'full';
                            break;
                        case 80 > el.properties.mask_adult && el.properties.mask_adult > 0:
                            calculateInfo.properties.mask_adult_storage = 'few';
                            break;
                        case el.properties.mask_adult === 0:
                            calculateInfo.properties.mask_adult_storage = 'none';
                            break;
                        default:
                            calculateInfo.properties.mask_adult_storage = 'none';
                            break;
                    }
                    switch (true) {
                        case el.properties.mask_child > 80:
                            calculateInfo.properties.mask_child_storage = 'full';
                            break;
                        case 80 > el.properties.mask_child && el.properties.mask_child > 0:
                            calculateInfo.properties.mask_child_storage = 'few';
                            break;
                        case el.properties.mask_child === 0:
                            calculateInfo.properties.mask_child_storage = 'none';
                            break;
                        default:
                            calculateInfo.properties.mask_child_storage = 'none';
                            break;
                    }
                    return calculateInfo;
                });

                renderMapInfo(calculateInfoAll);
            });
    } catch (error) {
        console.log(error);
    }
}
mapHandler();
// [{ properties: , geoinfo: }]

function renderMapInfo(data) {
    var markers = new L.MarkerClusterGroup().addTo(map);
    for (var i = 0; data.length > i; i++) {
        markers.addLayer(
            L.marker([data[i].geoinfo[1], data[i].geoinfo[0]], {
                get icon() {
                    switch (true) {
                        case data[i].properties.mask_adult > 80:
                            return icon.greenIcon;
                        case 80 > data[i].properties.mask_adult && data[i].properties.mask_adult > 0:
                            return icon.redIcon;
                        case data[i].properties.mask_adult === 0:
                            return icon.greyIcon;
                        default:
                            return icon.greyIcon;
                    }
                }
            }).bindPopup(
                `
                <div class='popcontent'>
                    <div class='masknum-adult s-${data[i].properties.mask_adult_storage}'>${data[i].properties.mask_adult}</div>
                    <div class='masknum-child s-${data[i].properties.mask_child_storage}'>${data[i].properties.mask_child}</div>
                </div>
                `
            )
        );
    }
    map.addLayer(markers);
}
function renderSidebarInfo() {}
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



async function go(){
    const data = await getData()
    const attrData = addAttr(data)
    const result = mapHandler(attrData)

}

function addAttr(data){
    return data
}

function getData() {
   
       return axios
            .get(
                'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR17_yFHM9x1Sq_us2j-cI3fRkyx9j7XiVibo2pqHY-Nl4uiW-esxRejZVc'
            )
            .then(({ data: { features } }) => {
                const calculateInfoAll = features.map(el => {
                    let calculateInfo = { properties: el.properties, geoinfo: el.geometry.coordinates };
                    switch (true) {
                        case el.properties.mask_adult > 80:
                            calculateInfo.properties.mask_adult_storage = 'full';
                            break;
                        case 80 > el.properties.mask_adult && el.properties.mask_adult > 0:
                            calculateInfo.properties.mask_adult_storage = 'few';
                            break;
                        case el.properties.mask_adult === 0:
                            calculateInfo.properties.mask_adult_storage = 'none';
                            break;
                        default:
                            calculateInfo.properties.mask_adult_storage = 'none';
                            break;
                    }
                    switch (true) {
                        case el.properties.mask_child > 80:
                            calculateInfo.properties.mask_child_storage = 'full';
                            break;
                        case 80 > el.properties.mask_child && el.properties.mask_child > 0:
                            calculateInfo.properties.mask_child_storage = 'few';
                            break;
                        case el.properties.mask_child === 0:
                            calculateInfo.properties.mask_child_storage = 'none';
                            break;
                        default:
                            calculateInfo.properties.mask_child_storage = 'none';
                            break;
                    }
                    return calculateInfo;
                });

                renderMapInfo(calculateInfoAll);
            });
    } catch (error) {
        console.log(error);
    }
}