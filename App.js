//App.js
import React, { Component }  from 'react';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as turf from '@turf/turf';
import tt from "@tomtom-international/web-sdk-services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
// TomTom SDK
import * as ttmaps from "@tomtom-international/web-sdk-maps";
// styles
import "@tomtom-international/web-sdk-maps/dist/maps.css";

function App() {
  var lattitude1
  var lattitude2
  var longittude1
  var longittude2

function  calculateDistance(lattitude1, longittude1,lattitude2,longittude2)
{
    
const toRadian = n => (n * Math.PI) / 180

    let lat2 = lattitude2
    let lon2 = longittude2
    let lat1 = lattitude1
    let lon1 = longittude1

    console.log(lat1, lon1+"==="+lat2, lon2)
    let R = 6371  // km
    let x1 = lat2 - lat1
    let dLat = toRadian(x1)
    let x2 = lon2 - lon1
    let dLon = toRadian(x2)
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    console.log("distance==?",d)
    return d 
      }


  const [map, setMap] = useState();
  const mapContainer = useRef();
  const ALGIERS = { lon: 3.042048, lat: 36.74896078368762 };

  async function createGeofence(lng, lat) {
    const request = await axios({
      method: "post",
      url: `https://api.tomtom.com/geofencing/1/projects/72c065c5-5f83-46dc-9261-816df559a4d9/fence?adminKey=9X44bTRquYvh2ERJOzdfDPggulPnF3cWZnKlQ87ZbTggOap2&key=wg6uKV7yCE2SrnOb3oUXvnwRWixOGuyZ`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        name: `Area ${Math.floor(Math.random() * 10000)}`,
        type: "Feature",
        geometry: {
          radius: 200,
          type: "Point",
          shapeType: "Circle",
          coordinates: [lng, lat],
        },
      }),
    });
    const response = await request.data;
    return response.id;
  }
  
  const [geofenceData, setgeofenceData] = useState({
    object: "my_driver",
    fenceName: "my_fence",
    time: new Date().toISOString(),
  });

  
 

  
  useEffect(() => {
    const  lng = 2.918053224434118;
    const lat =36.57358490377379;
    let map = ttmaps.map({
      key: "wg6uKV7yCE2SrnOb3oUXvnwRWixOGuyZ",
      container: mapContainer.current.id,
      center: ALGIERS,
      zoom: 10,
      language: "en-GB",
    });
    map.addControl(new ttmaps.FullscreenControl());
    map.addControl(new ttmaps.NavigationControl());


    setMap(map);
   
   
  
    setTimeout(()=>{
       
        console.log(turf);
        // creating source data with turf.js
        const sourceID = `circleData ${Math.floor(Math.random() * 10000)}`;
        let center = turf.point([lng, lat]);
        let radius = 2;
        let options = {
          steps: 15,
          units: "kilometers", // or "mile"
        };
        let circle = turf.circle(center, radius, options);
        map.addSource(sourceID, {
          type: "geojson",
          data: circle,
        });
  
        
    
    
        //fetching and drawing the map
        Promise.all([createGeofence(lng, lat)]).then((result) => {
          axios({
            method: "get",
            url: `https://api.tomtom.com/geofencing/1/fences/${result[0]}?key=wg6uKV7yCE2SrnOb3oUXvnwRWixOGuyZ`,
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.data)
            .then((result) => {
              map.addLayer({
                id: `circle ${Math.floor(Math.random() * 10000)}`,
                type: "fill",
                source: sourceID,
                paint: {
                  "fill-color": "blue",
                  "fill-opacity": 0.4,
                },
              });
            });
        }); 
    },[4000])

    function addMarker(lnglat) {
      const marker = new ttmaps.Marker({ draggable: true })
        .setLngLat(lnglat)
        .addTo(map);
  
      function onDragEnd() {
        
      var  lngLat = marker.getLngLat();
        new ttmaps.Popup({ closeOnClick: false })
          .setLngLat(lngLat)
          .setHTML(
            <div>
            <p> The object "${geofenceData.object}" crossed "${geofenceData.fenceName}" at ${geofenceData.time}</p>
          </div>
          )
          .addTo(map);
 
  
      }
      marker.on("dragend", onDragEnd);
      return marker
    }
    
     
    const cor = {lat:36.57458490377379  , lng: 3.0365037362416274}
    const nec = {lat: 37.5415762565345, lng: 4.0413613545166527}
    const rm = (mr)=>{
      setTimeout( _=>{
        mr.remove()
      }, 8000)
    }  

    const up = ()=>{
      for(let i = 0; i<3; i++){
        var mr = addMarker(cor);
        cor.lat += .02; 
      }
      
    }
    

    const mk = ()=>{setInterval(_=> {var mr = addMarker(cor);cor.lat += .02; return mr}, 5000)}
    const myIt = setInterval(_=> {
      var mr = addMarker(cor);
      cor.lng -= .02; 
      if(calculateDistance(cor.lat, cor.lng, lat, lng) <= 1.5) {
        clearInterval(myIt)
        }
    }, 3000)

    setTimeout(()=>{
       
      console.log(turf);
      // creating source data with turf.js
      const sourceID = `circleData ${Math.floor(Math.random() * 10000)}`;
      let center = turf.point([lng, lat]);
      let radius = 2;
      let options = {
        steps: 15,
        units: "kilometers", // or "mile"
      };
      let circle = turf.circle(center, radius, options);
      map.addSource(sourceID, {
        type: "geojson",
        data: circle,
      });

      
  
  
      //fetching and drawing the map
      Promise.all([createGeofence(lng, lat)]).then((result) => {
        axios({
          method: "get",
          url: `https://api.tomtom.com/geofencing/1/fences/${result[0]}?key=wg6uKV7yCE2SrnOb3oUXvnwRWixOGuyZ`,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.data)
          .then((result) => {
            map.addLayer({
              id: `circle ${Math.floor(Math.random() * 10000)}`,
              type: "fill",
              source: sourceID,
              paint: {
                "fill-color": "red",
                "fill-opacity": 0.5,
              },
            });
          });
      }); 
  },[17400])
    
  /*

   /*setTimeout(turnLeft, 12000)
   const turnLeft = setInterval(_=>{
      cor.lng -= .03;
      var mr  = addMarker(cor)
      if(calculateDistance(cor.lat, cor.lng, lat, lng) <= 2) clearInterval(turnLeft)
   }, 3000)*/

    
      
     /* while(calculateDistance(cor.lat,cor.lng,lat,lng) > 2){
        var mr = addMarker(cor);
         cor.lng -= .04
         if(cor.lng )
   // console.log(geofenceData.object); 
    rm(mr)
  }*/   
   
    
    map.on("click", (e) => {
      addMarker(e.lngLat);
      var d=calculateDistance(e.lngLat.lat,e.lngLat.lng,lat,lng)
      console.log(e.lngLat.lat,e.lngLat.lng);
    });
    
    return () => {
      map.remove();
    };
    //eslint-disable-next-line


  }, []);

  

  return (
    <div className="container">
      <nav className="nav">
        <h1> Geofencing in React</h1>
      </nav>
      <div ref={mapContainer} className="map" id="map" />
      <ToastContainer />
      
     
      
    
    </div>
    
    
  );
}
export default App;