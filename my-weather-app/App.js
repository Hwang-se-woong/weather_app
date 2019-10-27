import React, { Component } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Weather from "./Weather";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";

const API_KEY = "API_KEY";

export default class App extends Component {
  state = {
    isLoading: true
  };

  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );

    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp
    });
  };

  getLocation = async () => {
    try {
      const response = await Location.requestPermissionsAsync();
      //const location = await Location.getCurrentPositionAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you", "So sad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition}></Weather>
    );
  }
}
