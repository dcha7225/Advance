import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Chart from "../components/Chart";
import { useState, useEffect, useMemo, useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        console.log("entered");
    } catch (e) {
        console.log(e);
    }
};

const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.log(e);
    }
};
const clearData = async () => {
    try {
        await AsyncStorage.clear();
        console.log("Data cleared successfully!");
    } catch (e) {
        console.log(e);
    }
};

const removeFew = async (keys) => {
    try {
        await AsyncStorage.multiRemove(keys);
    } catch (e) {
        console.log(e);
    }
    console.log("Done");
};
const getAllKeys = async () => {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch (e) {
        console.log(e);
    }
    return keys;
};

export default function ChartScreen() {
    const [movement, setMovement] = useState([
        { label: "Bench Press", value: "Bench Press" },
        { label: "Squat", value: "Squat" },
        { label: "Deadlift", value: "Deadlift" },
        { label: "Shoulder Press", value: "Shoulder Press" },
    ]);
    const [moveOpen, setMoveOpen] = useState(false);
    const [moveValue, setMoveValue] = useState(null);

    const [repRange, setRepRange] = useState([
        { label: "1 rep max", value: [1, 1] },
        { label: "1-5", value: [1, 5] },
        { label: "6-10", value: [6, 10] },
        { label: "11-15", value: [11, 15] },
        { label: "16-20", value: [16, 20] },
    ]);
    const [rangeOpen, setRangeOpen] = useState(false);
    const [rangeValue, setRangeValue] = useState(null);

    const [dataSet, setDataSet] = useState([]);
    const [curData, setCurData] = useState([]);
    const isFocused = useIsFocused();
    const title = useRef("");

    useEffect(() => {
        if (isFocused) {
            const loadData = async () => {
                const allKeys = await getAllKeys();
                allKeys.sort((a, b) => new Date(a) - new Date(b));
                const dataPromises = allKeys.map(async (key) => {
                    const curData = await getData(key);
                    return { data: curData, date: key };
                });

                const data = await Promise.all(dataPromises);
                setDataSet(data);
            };
            loadData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (rangeValue != null && moveValue != null) {
            let d = [];
            for (let x = 0; x < dataSet.length; x++) {
                const curData = dataSet[x].data;
                let movement2;
                let lastIn = curData.length - 1;
                for (let y = 0; y <= lastIn; y++) {
                    if (curData[y].movement != "") {
                        movement2 = curData[y].movement;
                    }

                    if (movement2 == moveValue) {
                        if (
                            curData[y].reps <= rangeValue[1] &&
                            curData[y].reps >= rangeValue[0]
                        ) {
                            d.push(Number(curData[y].weight));
                        }
                        if (y == lastIn || curData[y + 1].movement != "") {
                            break;
                        }
                    }
                }
            }

            for (let i = 0; i < repRange.length; i++) {
                if (repRange[i].value == rangeValue) {
                    if (repRange[i].value[1] == 1) {
                        //checking if 1 rep max
                        title.current = moveValue.toString() + ": 1 rep max";
                    } else {
                        // any other range of reps
                        title.current =
                            moveValue.toString() +
                            ": " +
                            repRange[i].label +
                            " reps";
                    }
                }
            }
            setCurData(d);
        }
    }, [dataSet, rangeValue, moveValue]);
    return (
        <SafeAreaView style={styles.background}>
            <Text>Past Progress</Text>
            <View style={styles.new}>
                <View style={styles.inputs}>
                    <DropDownPicker
                        open={moveOpen}
                        value={moveValue}
                        items={movement}
                        setOpen={setMoveOpen}
                        setValue={setMoveValue}
                        setItems={setMovement}
                        containerStyle={styles.dropDown}
                        textStyle={{
                            fontSize: 12,
                        }}
                    />
                    <Text>Movement</Text>
                </View>

                <View style={styles.inputs}>
                    <DropDownPicker
                        open={rangeOpen}
                        value={rangeValue}
                        items={repRange}
                        setOpen={setRangeOpen}
                        setValue={setRangeValue}
                        setItems={setRepRange}
                        containerStyle={styles.dropDown}
                        textStyle={{
                            fontSize: 12,
                        }}
                    />
                    <Text>Rep Range</Text>
                </View>
            </View>
            {curData.length != 0 ? (
                <Chart dataset={curData} title={title.current} />
            ) : (
                <Text>No Data Reported</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    new: {
        width: "100%",
        height: 100,
        flexDirection: "row",
        zIndex: 1,
    },
    inputBox: {
        height: 45,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    inputs: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dropDown: {
        width: "80%",
        height: 60,
        top: 5,
        margin: 0,
    },
});
