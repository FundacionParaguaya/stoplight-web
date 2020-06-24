import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import green from '../../assets/green-dot.svg';

const {
  MarkerClusterer
} = require('react-google-maps/lib/components/addons/MarkerClusterer');

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoWindow: false,
      showInfoIndex: null
    };
    this.toggleInfo = this.toggleInfo.bind(this);
  }

  showInfo(i) {
    this.setState({ showInfoWindow: true, showInfoIndex: i });
  }

  toggleInfo() {
    this.setState({ showInfoWindow: false, showInfoIndex: null });
  }

  render() {
    let marks = this.props.markers.sort(
      (a, b) => a.householdID - b.householdID
    );
    const { props } = this;
    const { showInfoWindow, showInfoIndex } = this.state;
    return (
      <div>
        <GoogleMap defaultZoom={3} defaultCenter={{ lat: 20, lng: -15 }}>
          {props.isMarkerShown && (
            <div>
              <MarkerClusterer
                averageCenter
                minimumClusterSize={5}
                defaultMinimumClusterSize={5}
                gridSize={50}
                styles={[
                  {
                    url: '../../assets/m1.png',
                    height: 53,
                    lineHeight: 53,
                    width: 53,
                    textColor: 'white'
                  },
                  {
                    url: '../../assets/m2.png',
                    height: 56,
                    lineHeight: 56,
                    width: 56,
                    textColor: 'white'
                  },
                  {
                    url: '../../assets/m3.png',
                    height: 66,
                    lineHeight: 66,
                    width: 66,
                    textColor: 'orange'
                  },
                  {
                    url: '../../assets/m4.png',
                    height: 78,
                    lineHeight: 78,
                    width: 78,
                    textColor: 'white'
                  },
                  {
                    url: '../../assets/m5.png',
                    height: 90,
                    lineHeight: 90,
                    width: 90,
                    textColor: 'white'
                  }
                ]}
              >
                {marks
                  .filter(
                    marker =>
                      marker.coordinates &&
                      props.selectedColors.includes(marker.color)
                  )
                  .sort((a, b) => a.householdID - b.householdID)
                  .map((marker, i) => (
                    <Marker
                      key={marker.householdID}
                      icon={green}
                      position={{
                        lat: Number(marker.coordinates.split(',')[0]),
                        lng: Number(marker.coordinates.split(',')[1])
                      }}
                      onClick={() => {
                        this.showInfo(i);
                      }}
                    >
                      {showInfoWindow && showInfoIndex === i && (
                        <InfoWindow onCloseClick={this.toggleInfo}>
                          <div>
                            <h5>{marker.household}</h5>
                            <div>{marker.date}</div>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
              </MarkerClusterer>
            </div>
          )}
        </GoogleMap>
      </div>
    );
  }
}

export default withScriptjs(withGoogleMap(Map));
