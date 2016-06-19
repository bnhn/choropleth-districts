window.onload = function() {
    var districts;
    var zoom = 18,
    mapboxURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    Attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
   
   var light = L.tileLayer(mapboxURL, {
        attribution: Attribution,
        maxZoom: zoom,
        id: 'mapbox.light',
        accessToken: AccessToken
    }),
    satellite =  L.tileLayer(mapboxURL, {
        attribution: Attribution,
        maxZoom: zoom,
        id: 'mapbox.satellite',
        accessToken: AccessToken
    }),
    street =  L.tileLayer(mapboxURL, {
        attribution: Attribution,
        maxZoom: zoom,
        id: 'mapbox.mapbox-streets-v7',
        accessToken: AccessToken
    }),
    terrain =  L.tileLayer(mapboxURL, {
        attribution: Attribution,
        maxZoom: zoom,
        id: 'mapbox.mapbox-terrain-v2',
        accessToken: AccessToken
    }),
    osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: zoom,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    thunderforest= L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var baseMaps={
        "Light":light,
        "Satellite":satellite,
        "Street":street,
        "Terrain":terrain,
        "Open Street Maps":osm,
        "Thunderforest": thunderforest
    };
    var mymap = L.map('mapid',{
        layers:[light]
    }).setView([8.11361508149333, -1.20849609375], 7);
    L.control.layers(baseMaps).addTo(mymap);
    L.control.scale().addTo(mymap);

    var colors = ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"];
    function getColor(d) {
        return  d > 1000 ? colors[6] :
                d > 500 ? colors[5] :
                d > 200 ? colors[4] :
                d > 100 ? colors[3] :
                d > 50 ?  colors[2]:
                d > 10 ?  colors[1]:
                        colors[0];
    }

    function districtStyle(feature) {
        return {
            fillColor: getColor(feature.properties.Pop_Densit),
            weight: 1,
            opacity: 1,
            color: 'grey',
            dashArray: '',
            fillOpacity: 0.8
        };
    }

    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }

    function zoomOut(e) {
        mymap.setZoom(mymap.getMinZoom());
    }
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        controlCenter.update(layer.feature);
        console.log("layers: ",layer.feature);
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
    function resetHighlight(e) {
        districts.resetStyle(e.target);
        controlCenter.update();
    }
    districts = new L.geoJson(districtpopulation, {
        style: districtStyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<b>Region:</b> " + feature.properties.REGION + "<br>" +
                "<b>District:</b> " + feature.properties.DISTRICT + "<br>" +
                "<b>District Capital:</b> " + feature.properties.District_C + "<br>" +
                "<b>Population:</b> " + feature.properties.Pop_Total + "<br>" +
                "<b>Area (sq km)</b> :" + feature.properties.Area_sq_km);
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature,
                dblclick: zoomOut
            });
        }
    }).addTo(mymap);
    var legend = L.control({
        position: 'bottomleft'
    });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
            div.innerHTML='<h4>Legend</h4>';

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                '<span>'+grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] +'</span>'+ '</br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
    
    var controlCenter = L.control({
        position:'bottomright'
    });
    controlCenter.onAdd = function(map){
        this._div = L.DomUtil.create('div', 'controlCenter');
        this.update();
        return this._div;
    };
    controlCenter.update = function(attr){
        this._div.innerHTML ='<h4>ControlCenter</h4>'+ (attr ? '<b>Region: </b>'+attr.properties.REGION+'<br>'+
        '<b>District: </b>'+attr.properties.DISTRICT+
        '<br><b>District Capital: </b>'+
        attr.properties.District_C+'<br><b>District Code: </b>'+
        attr.properties.DistCode+'<br><b>Total Population: </b>'+
        attr.properties.Pop_Total+'<br><b>Male Population: </b>'+
        attr.properties.Male+'<br><b>Female Population: </b>'+
        attr.properties.Female+'<br><b>Population Density</b>'+
        attr.properties.Pop_Densit+'<br><b>Area (km<sup>2</sup>): </b>'+
        attr.properties.Area_sq_km+'span>km<sup>2</sup></span>' : 
        '<p>Hover over a district</p>')
    };
    controlCenter.addTo(mymap);
};