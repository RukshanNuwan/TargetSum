import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Game from "./components/Game";

const App = () => {
  const [gameId, setGameId] = useState(1);

  const resetGame = () => {
    setGameId(gameId + 1);
  };

  return (
    <View style={styles.container}>
      <Game key={gameId} randomNumberCount={6} initialSeconds={10} onPlayAgain={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eff1f2",
  },
});

export default App;
