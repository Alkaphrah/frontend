import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  'pk.eyJ1IjoicmVhbGl0eS1uZWFyLWRldnMiLCJhIjoiY2wzejY1Zm1tMXV1MTNicDRtZzViazRsNSJ9.Br1q0_qFPtNqIr59i-MqIA'

export default function IndexMaps() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-103.5917)
  const [lat, setLat] = useState(40.6699)
  const [zoom, setZoom] = useState(3)
  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom,
    })
    prueba(map)
  })
  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
  })
  const prueba = () => {
    console.log(map.current)
    map.current.on('load', () => {
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.current.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      })

      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      })

      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      })

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      })

      // inspect a cluster on click
      map.current.on('click', 'clusters', (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        })
        const clusterId = features[0].properties.cluster_id
        map.current
          .getSource('earthquakes')
          .getClusterExpansionZoom(clusterId, (err, zm) => {
            if (err) return
            console.log('zoom 1', zoom)
            const z = zoom + 3
            setZoom(z)
            console.log('2', zoom)
            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom,
            })
          })
      })

      map.current.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice()
        const { mag } = e.features[0].properties
        const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no'

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
          .addTo(map.current)
      })

      map.current.on('mouseenter', 'clusters', () => {
        map.current.getCanvas().style.cursor = 'pointer'
      })
      map.current.on('mouseleave', 'clusters', () => {
        map.current.getCanvas().style.cursor = ''
      })
    })
  }
  // useEffect(() => {
  //   if (!map.current) return // wait for map to initialize
  //   map.addLayer({
  //     id: 'clusters',
  //     type: 'circle',
  //     source: 'earthquakes',
  //     filter: ['has', 'point_count'],
  //     paint: {
  //       // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
  //       // with three steps to implement three types of circles:
  //       //   * Blue, 20px circles when point count is less than 100
  //       //   * Yellow, 30px circles when point count is between 100 and 750
  //       //   * Pink, 40px circles when point count is greater than or equal to 750
  //       'circle-color': [
  //         'step',
  //         ['get', 'point_count'],
  //         '#51bbd6',
  //         100,
  //         '#f1f075',
  //         750,
  //         '#f28cb1',
  //       ],
  //       'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  //     },
  //   })

  //   map.current.addLayer({
  //     id: 'cluster-count',
  //     type: 'symbol',
  //     source: 'earthquakes',
  //     filter: ['has', 'point_count'],
  //     layout: {
  //       'text-field': '{point_count_abbreviated}',
  //       'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
  //       'text-size': 12,
  //     },
  //   })

  //   map.current.addLayer({
  //     id: 'unclustered-point',
  //     type: 'circle',
  //     source: 'earthquakes',
  //     filter: ['!', ['has', 'point_count']],
  //     paint: {
  //       'circle-color': '#11b4da',
  //       'circle-radius': 4,
  //       'circle-stroke-width': 1,
  //       'circle-stroke-color': '#fff',
  //     },
  //   })
  // })
  // useEffect(() => {
  //   if (!map.current) return // wait for map to initialize
  //   map.current.addLayer({
  //     id: 'cluster-count',
  //     type: 'symbol',
  //     source: 'earthquakes',
  //     filter: ['has', 'point_count'],
  //     layout: {
  //       'text-field': '{point_count_abbreviated}',
  //       'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
  //       'text-size': 12,
  //     },
  //   })

  //   map.current.addLayer({
  //     id: 'unclustered-point',
  //     type: 'circle',
  //     source: 'earthquakes',
  //     filter: ['!', ['has', 'point_count']],
  //     paint: {
  //       'circle-color': '#11b4da',
  //       'circle-radius': 4,
  //       'circle-stroke-width': 1,
  //       'circle-stroke-color': '#fff',
  //     },
  //   })
  // })

  return (
    <div className="top">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}
