import {
    StyleSheet,
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    Keyboard,
} from "react-native";
import { useState, useEffect, useMemo, useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import TodayTable from "../components/TodayTable";
import RadioGroup from "react-native-radio-buttons-group";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function Today() {
    const [weight, onChangeWeight] = useState("");
    const [reps, onChangeReps] = useState("");
    const [tracked, setTracked] = useState([]);
    const [movement, setMovement] = useState([
        { label: "Bench Press", value: "Bench Press" },
        { label: "Squat", value: "Squat" },
        { label: "Deadlift", value: "Deadlift" },
        { label: "Shoulder Press", value: "Shoulder Press" },
    ]);
    const [repRange, setRepRange] = useState([
        { label: "1 rep max", value: [1, 1] },
        { label: "1-5", value: [1, 5] },
        { label: "6-10", value: [6, 10] },
        { label: "11-15", value: [11, 15] },
        { label: "16-20", value: [16, 20] },
    ]);
    const [moveOpen, setMoveOpen] = useState(false);
    const [moveValue, setMoveValue] = useState(null);
    const [rangeOpen, setRangeOpen] = useState(false);
    const [rangeValue, setRangeValue] = useState(null);
    const [selectedPO, setSelectedPO] = useState("2");

    let today = new Date();
    today =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

    const firstMount = useRef(false);
    const dataSet = useRef([]);

    const radioButtons = useMemo(
        () => [
            {
                id: "1",
                label: "yes",
                value: "yes",
            },
            {
                id: "2",
                label: "no",
                value: "no",
            },
        ],
        []
    );

    useEffect(() => {
        const loadData = async () => {
            const allKeys = await getAllKeys();
            allKeys.sort((a, b) => new Date(a) - new Date(b));
            const dataPromises = allKeys.map(async (key) => {
                const curData = await getData(key);
                return { data: curData, date: key };
            });

            dataSet.current = await Promise.all(dataPromises);
            const curData = dataSet.current;
            if (curData[curData.length - 1].date == today) {
                setTracked(curData[curData.length - 1].data);
            }
            console.log("updated");
        };
        loadData();
        firstMount.current = true;
        //removeFew([today]);
    }, []);

    const suggPO = useMemo(() => {
        if (rangeValue != null && moveValue != null) {
            if (tracked.length > 0) {
                let movement1;
                let index = null;
                let lastIn = tracked.length - 1;
                for (let y = 0; y <= lastIn; y++) {
                    if (tracked[y].movement != "") {
                        movement1 = tracked[y].movement;
                    }
                    if (movement1 == moveValue) {
                        if (
                            tracked[y].reps <= rangeValue[1] &&
                            tracked[y].reps >= rangeValue[0]
                        ) {
                            index = y;
                        }
                        if (y == lastIn || tracked[y + 1].movement != "") {
                            break;
                        }
                    }
                }
                if (index != null) {
                    if (tracked[index].reps == rangeValue[1]) {
                        return (Number(tracked[index].weight) + 5).toString();
                    } else if (tracked[index].reps == rangeValue[0]) {
                        return (Number(tracked[index].weight) - 5).toString();
                    } else {
                        return tracked[index].weight;
                    }
                }
            }
            for (let x = dataSet.current.length - 1; x >= 0; x--) {
                const curData = dataSet.current[x].data;
                let movement2;
                let index = null;
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
                            index = y;
                        }
                        if (y == lastIn || curData[y + 1].movement != "") {
                            break;
                        }
                    }
                }
                if (index != null) {
                    if (curData[index].reps == rangeValue[1]) {
                        return (Number(curData[index].weight) + 5).toString();
                    } else if (curData[index].reps == rangeValue[0]) {
                        return (Number(curData[index].weight) - 5).toString();
                    } else {
                        return curData[index].weight;
                    }
                }
            }
            return null; //not enough data
        }
    }, [rangeValue, tracked, moveValue]);

    useEffect(() => {
        if (!firstMount.current) {
            storeData(today, tracked);
        }
    }, [tracked]);

    useEffect(() => {
        setRangeValue(null);
    }, [selectedPO]);

    const handleSubmit = async (m, w, r) => {
        let found = false;
        let entered = false;
        if (m != null && w != "" && r != "") {
            for (let i = 0; i < tracked.length; i++) {
                if (!found && tracked[i].movement == m) {
                    found = true;
                } else if (found && tracked[i].movement != "") {
                    setTracked([
                        ...tracked.slice(0, i),
                        {
                            movement: "",
                            weight: w,
                            reps: r,
                            id: tracked.length,
                        },
                        ...tracked.slice(i),
                    ]);
                    entered = true;
                    setMoveOpen(false);
                    setRangeOpen(false);
                    onChangeReps("");
                    onChangeWeight("");
                    Keyboard.dismiss();
                    break;
                }
                if (found && i == tracked.length - 1) {
                    setTracked([
                        ...tracked,
                        {
                            movement: "",
                            weight: w,
                            reps: r,
                            id: tracked.length,
                        },
                    ]);
                    entered = true;
                    setMoveOpen(false);
                    setRangeOpen(false);
                    onChangeReps("");
                    onChangeWeight("");
                    Keyboard.dismiss();
                }
            }
            if (!entered) {
                setTracked([
                    ...tracked,
                    {
                        movement: m,
                        weight: w,
                        reps: r,
                        id: tracked.length,
                    },
                ]);
                setMoveOpen(false);
                setRangeOpen(false);
                onChangeReps("");
                onChangeWeight("");
                Keyboard.dismiss();
            }
        }
        firstMount.current = false;
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        return false;
    };

    return (
        <SafeAreaView
            style={styles.background}
            onStartShouldSetResponder={dismissKeyboard}
        >
            <Text> ADVANCE </Text>
            <View style={styles.new}>
                <View style={styles.inputs}>
                    <DropDownPicker
                        open={moveOpen}
                        value={moveValue}
                        items={movement}
                        setOpen={setMoveOpen}
                        setValue={setMoveValue}
                        setItems={setMovement}
                        containerStyle={{
                            width: "90%",
                            height: 60,
                            top: 5,
                            margin: 0,
                        }}
                        textStyle={{
                            fontSize: 12,
                        }}
                    />
                    <Text>Movement</Text>
                </View>
                {selectedPO == 1 && (
                    <View style={styles.inputs}>
                        <DropDownPicker
                            open={rangeOpen}
                            value={rangeValue}
                            items={repRange}
                            setOpen={setRangeOpen}
                            setValue={setRangeValue}
                            setItems={setRepRange}
                            containerStyle={{
                                width: "90%",
                                height: 60,
                                top: 5,
                                margin: 0,
                            }}
                            textStyle={{
                                fontSize: 12,
                            }}
                        />
                        <Text>Rep Range</Text>
                    </View>
                )}

                <View style={styles.inputs}>
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={onChangeReps}
                        value={reps}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                    <Text>Reps</Text>
                </View>
                <View style={styles.inputs}>
                    <TextInput
                        style={styles.inputBox}
                        onChangeText={onChangeWeight}
                        value={weight}
                        placeholder={
                            selectedPO == 1
                                ? suggPO == null
                                    ? "Need data"
                                    : suggPO + "lbs"
                                : "0lbs"
                        }
                        keyboardType="numeric"
                    />
                    <Text>Weight</Text>
                </View>
            </View>
            <View style={styles.RadioButtonContainer}>
                <Text style={{ fontSize: 14, marginLeft: 5 }}>
                    Suggest Progressive Overload:
                </Text>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedPO}
                    selectedId={selectedPO}
                    layout="row"
                />
            </View>
            <TouchableHighlight
                onPress={() => handleSubmit(moveValue, weight, reps)}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </View>
            </TouchableHighlight>
            <View style={styles.table}>
                <TodayTable data={tracked} setTracked={setTracked} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: "#fff",
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
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "grey",
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
    table: {
        height: 490,
        width: "100%",
    },
    RadioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        marginVertical: 5,
    },
});
