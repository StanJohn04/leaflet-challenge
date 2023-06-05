let geojsonData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(geojsonData)


d3.json(geojsonData).then(function(geoJson) {
    console.log(geoJson)
});

//function to create map object
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

// Create a legend to display information about our map.
    var info = L.control({
        position: "bottomright"
    });
    
    // When the layer control is added, insert a div with the class of 'info' && "legend".
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 30, 50, 70, 90];

        // title for legend
        div.innerHTML += "<h3>Earthquake Depth</h3>"

        //loop through depths to add color hex and label in legend (ex. [lightgreen]10-30)
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i]) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add the info legend to the map.
    info.addTo(mymap);
  
}

// function to pick color for color squares in legend
function getColor(d) {
    return d >= 90 ? 'rgb(168, 9, 9)' :
           d >= 70  ? 'rgb(238, 104, 55)' :
           d >= 50  ? 'orange' :
           d >= 30  ? 'yellow' :
           d >= 10   ? 'greenyellow' :
                      'green';
}

// function to pick color for each marker
function markerColor(depth) {
    if (depth <10 ) {
        color = "green"
    }
    else if (depth >= 10 && depth <= 30) {
        color = "greenyellow"
    }
    else if (depth > 30 && depth <= 50) {
        color = "yellow"
    }
    else if (depth > 50 && depth <= 70) {
        color = "orange"
    }
    else if (depth > 70 && depth <= 90) {
        color = "darkorange"
    }
    else if (depth > 90) {
        color = "red"
    }
    
    return color
}

// function to create a marker for each earthquake in data set
function createMarkers(response) {

    //pull all quake data
    var quakes = response.features;

    //initialize variable to hold markers
    var quakeMarkers = [];

    //loop through quake data and create marker for each one
    for (let i = 0; i < quakes.length; i ++) {
        var quake = quakes[i];

        //cirle at each quake coords, color = depth, radius = magnitude
        var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
            color:markerColor(quake.geometry.coordinates[2]),
            fillColor:markerColor(quake.geometry.coordinates[2]),
            fillOpacity:0.5,
            radius:quake.properties.mag * 10000
        }).bindPopup(`<h1>${quake.properties.place}</h1> <h3>Lat: ${quake.geometry.coordinates[1]}</h3><h3>Lon: ${quake.geometry.coordinates[0]}</h3><h3>Magnitude: ${quake.properties.mag}</h3><h3>Depth: ${quake.geometry.coordinates[2]}</h3> `)

        //add subset to array
        quakeMarkers.push(quakeMarker);
    }
    //call createMap function
    createMap(L.layerGroup(quakeMarkers));
}

//API request and createMarkers function call
d3.json(geojsonData).then(function(data) {
    createMarkers(data);
});