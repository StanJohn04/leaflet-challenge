let geojsonData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(geojsonData)


d3.json(geojsonData).then(function(geoJson) {
    console.log(geoJson)
});

function createMap(earthquakes) {

    var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    var baseLayers = {
        "Street": streetMap
    };

    var overlays = {
        "Earthquakes": earthquakes
    };

    var mymap = L.map('map', {
        center: [40, -100],
        zoom: 4.0,
        layers: [streetMap, earthquakes]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
}

function markerColor(depth) {
    if (depth <=10 ) {
        color = "green"
    }
    else if (depth > 10 && depth <= 30) {
        color = "greenyellow"
    }
    else if (depth > 30 && depth <= 50) {
        color = "yellow"
    }
    else if (depth > 50 && depth <= 70) {
        color = "orange"
    }
    else if (depth > 70 && depth <= 90) {
        color = "orangered"
    }
    else if (depth > 90) {
        color = "red"
    }
    
    return color
}

function createMarkers(response) {
    var quakes = response.features;

    var quakeMarkers = [];

    for (let i = 0; i < quakes.length; i ++) {
        var quake = quakes[i];

        var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
            color:markerColor(quake.geometry.coordinates[2]),
            fillColor:markerColor(quake.geometry.coordinates[2]),
            fillOpacity:0.5,
            radius:quake.properties.mag * 10000
        })

        quakeMarkers.push(quakeMarker);
    }
    createMap(L.layerGroup(quakeMarkers));
}

d3.json(geojsonData).then(function(data) {
    createMarkers(data);
});