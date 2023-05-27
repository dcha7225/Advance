import {
    StyleSheet,
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Table from "../components/Table";

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

export default function Today() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Bench Press", value: "Bench Press" },
        { label: "Squat", value: "Squat" },
        { label: "Deadlift", value: "Deadlift" },
        { label: "Shoulder Press", value: "Shoulder Press" },
    ]);
    const [weight, onChangeWeight] = useState("");
    const [reps, onChangeReps] = useState("");
    const [tracked, setTracked] = useState([]);

    let today = new Date();
    today =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

    useEffect(() => {
        if (tracked.length > 0) {
            storeData(today, tracked);
        }
    }, [tracked]);

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
                    setOpen(false);
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
                    setOpen(false);
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
                setOpen(false);
                onChangeReps("");
                onChangeWeight("");
                Keyboard.dismiss();
            }
        }
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
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        containerStyle={{
                            width: "90%",
                            height: 60,
                            top: 5,
                            margin: 0,
                        }}
                    />
                    <Text>Excercise</Text>
                </View>
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
                        placeholder="0lbs"
                        keyboardType="numeric"
                    />
                    <Text>Weight</Text>
                </View>
            </View>
            <TouchableHighlight
                onPress={() => handleSubmit(value, weight, reps)}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </View>
            </TouchableHighlight>
            <View style={styles.table}>
                <Table data={tracked} />
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
        height: 530,
        width: "100%",
    },
});
