import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RandomNumber from "./RandomNumber";
import PropTypes from "prop-types";
import shuffle from "lodash.shuffle";

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  gameStatus = "Playing";

  randomNumbers = Array.from({ length: this.props.randomNumberCount }).map(() => 1 + Math.floor(10 * Math.random()));
  target = this.randomNumbers.slice(0, this.props.randomNumberCount - 2).reduce((acc, curr) => acc + curr, 0);

  shuffleRandomNumbers = shuffle(this.randomNumbers);

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1 };
      }, () => {
        if (this.state.remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0) {
      this.gameStatus = this.calcGameStatus(nextState);

      if (this.gameStatus !== "Playing") {
        clearInterval(this.intervalId);
      }
    }
  }

  isNumberDisabled = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffleRandomNumbers[curr];
    }, 0);

    if (nextState.remainingSeconds === 0) {
      return "Lost";
    }

    if (sumSelected < this.target) {
      return "Playing";
    }

    if (sumSelected === this.target) {
      return "Won";
    }

    if (sumSelected > this.target) {
      return "Lost";
    }
  };

  render() {
    const gameStatus = this.gameStatus;

    return (
      <View style={styles.container}>
        <Text style={styles.target}>{this.target}</Text>
        <View style={styles.randomContainer}>
          {this.shuffleRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={randomNumber}
              isDisabled={this.isNumberDisabled(index) || gameStatus !== "Playing"}
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameStatus !== "Playing" && (
          <TouchableOpacity onPress={this.props.onPlayAgain} style={styles.button}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.remainingSeconds}>{this.state.remainingSeconds}</Text>
        <Text style={[styles.gameStatus, styles[`status${gameStatus}`]]}>{gameStatus}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  target: {
    width: 256,
    padding: 32,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#2b6673",
    color: "#e0f5fa",
    borderRadius: 32,
  },
  randomContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 8,
  },
  button: {
    width: "85%",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#e5d089",
    color: "#73672b",
    borderRadius: 32,
  },
  buttonText: {
    fontSize: 22,
  },
  remainingSeconds: {
    width: 90,
    textAlign: "center",
    padding: 24,
    marginBottom: 16,
    fontSize: 32,
    fontWeight: "bold",
    color: "#8f3965",
    backgroundColor: "#c9a4b7",
    borderRadius: 45,
  },
  gameStatus: {
    width: "100%",
    padding: 24,
    fontSize: 20,
    textAlign: "center",
    borderRadius: 32,
  },
  statusPlaying: {
    backgroundColor: "#c0c6dc",
    color: "#2b6673",
  },
  statusWon: {
    backgroundColor: "#c3dcc0",
    color: "#3b732b",
  },
  statusLost: {
    backgroundColor: "#dcc0c0",
    color: "#732b2b",
  },
});

export default Game;
