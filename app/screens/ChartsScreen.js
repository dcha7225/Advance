import { StyleSheet, SafeAreaView, View } from "react-native";
import MenuBar from "../components/MenuBar";
import Chart from "../components/Chart";

export default function ChartScreen() {
    return (
        <SafeAreaView style={styles.background}>
            <Chart
                dataset={[5, 10, 50, 20, 30, 10, 10, 10, 10, 10, 10]}
                title={"1 rep Bench"}
            />
            <MenuBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
});
