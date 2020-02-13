const medinfo = [];
axios
    .get(
        'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR17_yFHM9x1Sq_us2j-cI3fRkyx9j7XiVibo2pqHY-Nl4uiW-esxRejZVc'
    )
    .then(({ data: { features } }) => {
        // console.log(features, features[0].properties, features[0].geometry);
        features.map(el => {
            medinfo.push({ properties: el.properties, geoinfo: el.geometry.coordinates });
        });
        console.log(medinfo);
        var greenIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // for (var i = 0; medinfo.length > i; i++) {
        //     L.marker([medinfo[i].geoinfo[1], medinfo[i].geoinfo[0]], { icon: greenIcon })
        //         .addTo(map)
        //         .bindPopup('<h1>' + medinfo[i].properties.name + '</h1>');
        // }
    });

var map = L.map('map', {
    center: [22.604964, 120.300476],
    zoom: 16
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
