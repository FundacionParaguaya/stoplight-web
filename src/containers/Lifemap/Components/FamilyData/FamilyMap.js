import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import {Gmaps, Marker, InfoWindow} from 'react-gmaps';



const params = {v: '3.exp', key: 'AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM'};

class FamilyMap extends Component {
  constructor(){
    super()
    this.state = { // set paraguay HQ
      lat: -25.3092612,
      lng: -57.5872545
    }
    this.getLocation()

  }

  async getLocation() {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      });
    } else {
      return
    }
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  onCloseClick() {
    console.log('onCloseClick');
  }

  onClick(e) {
    console.log('onClick', e);
  }

  render() {

    return (
      <Gmaps
        width={'800px'}
        height={'600px'}
        lat={this.state.lat}
        lng={this.state.lng}
        zoom={12}
        loadingMessage={'Please wait while the map is loading.'}
        params={params}
        onMapCreated={this.onMapCreated}>
        <Marker
          lat={this.state.lat}
          lng={this.state.lng}
          draggable={true}
          onDragEnd={this.onDragEnd} />
      </Gmaps>
    );
  }

};


const mapDispatchToProps = {
  addSurveyData,
  addSurveyDataWhole
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FamilyMap)
