import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Table from "../components/Table";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from "react";

export default function Journal({ data }) {
    const options = { month: "short", day: "numeric", year: "numeric" };
    const today = new Date().toLocaleDateString(undefined, options);
    const [currentIndex, setCurrentIndex] = useState(0);

    let dataSet = [
        {
            date: "May 21, 2023",
            data: [
                { movement: "test", reps: "10", weight: "20", id: "1" },
                { movement: "test", reps: "10", weight: "20", id: "2" },
                { movement: "test", reps: "10", weight: "20", id: "3" },
            ],
        },
        {
            date: "May 20, 2023",
            data: [
                { movement: "test", reps: "10", weight: "20", id: "1" },
                { movement: "test", reps: "10", weight: "20", id: "2" },
                { movement: "test", reps: "10", weight: "20", id: "3" },
                { movement: "test", reps: "10", weight: "20", id: "4" },
            ],
        },
        {
            date: "May 19, 2023",
            data: [
                { movement: "test", reps: "10", weight: "20", id: "1" },
                { movement: "test", reps: "10", weight: "20", id: "2" },
                { movement: "test", reps: "10", weight: "20", id: "3" },
            ],
        },
    ];

    let currentData = dataSet[currentIndex].data;
    let currentDate = dataSet[currentIndex].date;

    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.pageControl}>
                <View
                    style={currentIndex + 1 >= dataSet.length && { opacity: 0 }}
                >
                    <Ionicons.Button
                        name="arrow-back-outline"
                        backgroundColor="black"
                        onPress={() => {
                            if (currentIndex + 1 < dataSet.length) {
                                setCurrentIndex(currentIndex + 1);
                            }
                        }}
                    />
                </View>
                <Text style={styles.date}>
                    {currentDate === today ? "Today" : currentDate}
                </Text>
                <View style={currentIndex - 1 < 0 && { opacity: 0 }}>
                    <Ionicons.Button
                        name="arrow-forward-outline"
                        backgroundColor="black"
                        onPress={() => {
                            if (currentIndex - 1 >= 0) {
                                setCurrentIndex(currentIndex - 1);
                            }
                        }}
                    />
                </View>
            </View>
            <Table data={currentData} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    pageControl: {
        width: "100%",
        height: 40,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    date: {
        marginHorizontal: 20,
    },
});
