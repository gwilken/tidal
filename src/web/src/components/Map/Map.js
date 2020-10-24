import './Map.scss'

import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';


let initialCenter = {lng: -79.09460554196545, lat: 28.475889863700047}
// const initialZoom = [5]


class Map extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiZ3dpbGtlbiIsImEiOiJjanI1ajR6Z2QwMWk1NDRubXYyYmV6OHVkIn0.D68kEgoBzr8IZn8zz40MOQ',
      attributionControl: false,
      logoPosition: 'top-left', 
      container: this.mapContainer,
      style: 'mapbox://styles/gwilken/cjxwljb4b1kt51cl63y6wzr0w',
      center: initialCenter,
      zoom: 6
    });
 
    fetch('/stations/stations.geojson')
      .then(res => res.json())
      .then(data => {
        this.map.addSource('geojson-markers', {
          'type': 'geojson',
          data
        })

        this.map.addLayer({
          id: 'markers',
          source: 'geojson-markers',
          type: 'circle',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': [
              'case', ['boolean', ['feature-state', 'hover'], false],
              7,
              5
            ],
            'circle-stroke-width': [
              'case', ['boolean', ['feature-state', 'hover'], false],
              3,
              1
            ],
            'circle-stroke-color': [
              'case', ['boolean', ['feature-state', 'hover'], false],
              'rgba(251, 104, 57, 1)',
              'rgba(50, 98, 234, 1)'
            ],
            'circle-color':[
                'case', ['boolean', ['feature-state', 'hover'], false],
                'rgba(251, 104, 57, .6)',
                'rgba(50, 98, 234, .6)'
              ]
            }
          });

          this.map.addLayer({
            id: "marker-labels",
            type: "symbol",
            source: "geojson-markers",
            layout: { 
              "text-size": 14, 
              "text-field": 
                ["case",
                  ["to-boolean", ["get","state"]],
                    ["concat", ["get","name"],", ",["get","state"]],
                  ["get","name"]
                ],
              "text-anchor": "left",
              "text-offset": [.75, -1] },
            paint: {
                "text-color": "rgba(0, 0, 0, 1)",
                "text-halo-color": "rgb(255,255,255)",
                "text-halo-width":  [
                  'case', ['boolean', ['feature-state', 'hover'], false],
                  3,
                  1
                ]
              }
          })
       
      })

      this.map.on('click', 'markers', this.handleMarkerClick)
  }


  handleMarkerClick = (e) => {
    let features = e.target.queryRenderedFeatures(e.point, {
      layers: ['markers']
    })

    if (features && features.length > 0) {
      let { properties = { }} = features[0]
      let { harcon_id, id } = properties
   
      console.log('harcon_id:', harcon_id, 'id:', id)

      // fallback to id, id no harcon_id. dont know if this actually will return anything
      this.updateHarmonics(harcon_id ? harcon_id : id)

      // TODO: open sines window, display sines

      // handlePopupOpen({ location_latitude, location_longitude, id })

      // const placeholder = document.createElement('div');
      // ReactDOM.render((<Popup {...properties} />), placeholder);

      // new mapboxgl.Popup()
      //   .setLngLat({lng: location_longitude, lat: location_latitude})
      //   .setDOMContent(placeholder)
      //   .addTo(this.map);
    
    } 
    
    // else {
    //   this.props.setPopupCoords([0, 0])
    // }
  }


  updateHarmonics = (id) => {
    fetch(`/harmonics/${id}.json`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
      .catch(e => {
        console.log('error fetching harmonics:', e)
      })
  }



  // componentDidUpdate(prevProps) {
  //   if (this.props.markers !== prevProps.markers) {

  //     console.log('NEW MARKERS', this.props.markers)
  //     this.map.getSource('geojson-markers').setData(this.props.markers.data); 

  //     //     if (this.state.map && this.props.markers.data.features.length > 0) {  
  // //       let newLngLatBounds = new LngLatBounds().extend([this.props.markers.data.features[0].properties.location_longitude, this.props.markers.data.features[0].properties.location_latitude])
  // //       let coordinates = this.props.markers.data.features.map(elem => {
  // //         if (elem.properties.location_longitude && elem.properties.location_latitude) {
  // //          return newLngLatBounds.extend([elem.properties.location_longitude, elem.properties.location_latitude])
  // //         } else {
  // //           return null
  // //         }
  // //       })
  // //       let newBounds = new LngLatBounds()
  // //       let bounds = coordinates.reduce((bounds, coord) => {
  // //         return newBounds.extend(coord)
  // //       })
  // //       if (!this.props.isSearchOnMapMoveToggled) {
  // //         this.state.map.fitBounds(bounds, {
  // //           padding: 50
  // //         })
  // //       }  
  // //     }
  //   }

  //   if (this.props.moveMapToPosition !== prevProps.moveMapToPosition) {
  //     this.map.jumpTo(this.props.moveMapToPosition)
  //   }

  //   if (this.props.isResultsDrawerToggled !== prevProps.isResultsDrawerToggled) {
  //     this.map.resize()
  //     this.props.setUrl()
  //   }
  
  //   if (this.props.resizeMap !== prevProps.resizeMap) {
  //     this.map.resize()
  //   }

  //   if (this.props.currentMapPosition !== prevProps.currentMapPosition) {
  //     this.props.setUrl()
  //   }

  //   if (this.props.url !== prevProps.url) {
  //     this.props.history.replace(this.props.url)
  //   }

  //   if (this.props.forceGetDisplayedFeatures !== prevProps.forceGetDisplayedFeatures) {
  //     this.getDisplayedFeatures()
  //   }

  //   if (this.props.jumpToMapPosition !== prevProps.jumpToMapPosition) {
  //     this.map.jumpTo(this.props.jumpToMapPosition)
  //   }
    
  //   if (this.props.isPopupOpen !== prevProps.isPopupOpen) {
  //     if (!this.props.isPopupOpen) {
  //       this.map.scrollZoom.enable()
  //     }
  //   }    
  // }


  // getDisplayedFeatures = () => {
  //   if (this.props.isMapLoaded) {
  //     let features = this.map.queryRenderedFeatures({
  //       layers: ['markers']
  //     })      
  //     this.props.updateDisplayedFeatures(features)
  //   }
  // }


  // handleMapMoveEnd = () => {
  //   let {_ne, _sw} = this.map.getBounds()
    
  //   this.props.setCurrentMapPosition(
  //     {
  //       center: this.map.getCenter(),
  //       zoom: [this.map.getZoom()],
  //       bounds: {_ne: _ne.wrap(), _sw: _sw.wrap()}
  //     }
  //   )

  //   if (this.props.isSearchOnMapMoveToggled) {
  //    searchWithinBoundingBox( {_ne: _ne.wrap(), _sw: _sw.wrap()})
  //   }
  //   this.getDisplayedFeatures()
  //   this.props.setUrl()
  // }


  // handleMarkerHover = (e) => {
  //   // let features = this.map.queryRenderedFeatures(e.point, {
  //   //   layers: ['markers'],
  //   //   filters: ["!", ["has", "point_count"]]
  //   // })

  //   if (e.features && e.features.length > 0) {
  //     this.map.getCanvas().style.cursor = 'pointer'

  //     if ( this.state.hoveredMarkerId) {
  //       this.map.setFeatureState(
  //         { source: 'geojson-markers', id: this.state.hoveredMarkerId },
  //         { hover: false }
  //       );
  //     }

  //     this.setState({ hoveredMarkerId: e.features[0].id })

  //     this.map.setFeatureState(
  //       { source: 'geojson-markers', id: this.state.hoveredMarkerId },
  //       { hover: true }
  //     );
  //   } 
  // }


  // handleMarkerHoverLeave = (e) => {
  //   this.map.getCanvas().style.cursor = 'grab'

  //   this.map.setFeatureState(
  //     { source: 'geojson-markers', id: this.state.hoveredMarkerId },
  //     { hover: false }
  //     );
  // }


  // handleMapClick = (e) => {
  //   console.log('lon:')
  //   console.log(e.lngLat.lng)
  //   console.log('lat:')
  //   console.log(e.lngLat.lat)
    
  //   this.map.scrollZoom.enable()
  //   let features = this.map.queryRenderedFeatures(e.point, {
  //     layers: ['markers']
  //   })
  //   if (features.length < 1) {
  //    this.props.togglePopup(false)
  //   }
  // }


  // handleMarkerClick = (e) => {
  //   let features = e.target.queryRenderedFeatures(e.point, {
  //     layers: ['markers']
  //   })

  //   if (features && features.length > 0) {
  //     let { properties = { }} = features[0]
  //     let { location_latitude, location_longitude, id } = properties
   
  //     // handlePopupOpen({ location_latitude, location_longitude, id })

  //     const placeholder = document.createElement('div');
  //     ReactDOM.render((<Popup {...properties} />), placeholder);

  //     new mapboxgl.Popup()
  //       .setLngLat({lng: location_longitude, lat: location_latitude})
  //       .setDOMContent(placeholder)
  //       .addTo(this.map);
      

  //   } else {
  //     this.props.setPopupCoords([0, 0])
  //   }
  // }
  

  // handleClusterClick = (e) => {
  //   let features = e.target.queryRenderedFeatures(e.point, {
  //     layers: ['clusters']
  //   })
  //   let clusterId = features[0].properties.cluster_id;

  //   this.map.getSource('geojson-markers').getClusterExpansionZoom(clusterId, (err, zoom) => {
  //   if (err)
  //     return;
  //     this.map.jumpTo({
  //       center: features[0].geometry.coordinates,
  //       zoom: zoom
  //     });
  //   });
  // }
  
  // handleMapLoad = (map) => {
  //   this.setState({ map })
  //   this.props.setIsMapLoaded(true)
  //   // this.props.setIsSearchOnMapMoveToggled(true)

  //   if (this.props.location.search) {
  //     setInitialAppState(this.props.location.search)
  //   } else {
  //     this.props.setCurrentMapPosition({
  //       center: map.getCenter(),
  //       zoom: [map.getZoom()],
  //       bounds:  map.getBounds() }
  //     )
  
  //     searchWithinBoundingBox(this.props.currentMapPosition.bounds)
  
  //     setTimeout(() => {
  //       this.getDisplayedFeatures()
  //     }, 1500)
  //   }
  // }
  
  // handleSourceLoad = (map) => {
  //   this.props.setIsSourceLoaded(true)
  // }


  // handlePopupMouseEnter = () => {
  //   this.map.scrollZoom.disable()
  // }


  // handlePopupMouseLeave = () => {
  //   this.map.scrollZoom.enable()
  // }


  render() {
    return (
      
      <div className="map" ref={el => this.mapContainer = el}></div>
      
    )
  }
}


export default Map