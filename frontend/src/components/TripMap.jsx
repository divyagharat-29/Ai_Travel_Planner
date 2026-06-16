import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import '../styles/components/TripMap.css'

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '10px'
}

function TripMap({ destination }) {
  const [coordinates, setCoordinates] = useState(null)

  useEffect(() => {
    // Use OpenStreetMap Nominatim for free geocoding
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`
        )
        const data = await response.json()
        if (data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          })
        }
      } catch (err) {
        console.error('Geocoding failed:', err)
      }
    }

    fetchCoordinates()
  }, [destination])

  return (
    <div className="trip-map">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinates || { lat: 20.5937, lng: 78.9629 }}
          zoom={coordinates ? 12 : 5}
          options={{
            styles: mapStyles,
            zoomControl: true,
          }}
        >
          {coordinates && <Marker position={coordinates} />}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242424' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242424' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#d4d4d4' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }]
  },
]

export default TripMap