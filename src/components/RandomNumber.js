import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RandomNumber = ({ id, number, isDisabled, onPress }) => {
  const onPressHandler = () => {
    if (isDisabled) {
      return;
    }

    onPress(id);
  }

  return (
    <View>
      <TouchableOpacity onPress={onPressHandler}>
        <Text style={[styles.random, isDisabled && styles.disabled]}>{number}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  random: {
    width: 128,
    marginVertical: 24,
    paddingVertical: 12,
    backgroundColor: "#87b0b6",
    fontSize: 32,
    textAlign: "center",
    borderRadius: 32,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default RandomNumber;
