import {
    StyleSheet,
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    Keyboard,
    Image,
} from "react-native";
import { useState, useEffect, useMemo, useRef, useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import TodayTable from "../components/TodayTable";
import RadioGroup from "react-native-radio-buttons-group";
import Dialog from "react-native-dialog";
import { MyContext } from "../components/ContextProvider";
import { getAllKeys, getData, storeData } from "../../AsyncStor";

export default function Today() {
    const {
        tracked,
        setTracked,
        intValue,
        inc,
        movement,
        setMovement,
        firstMount,
        repRange,
        setRepRange,
    } = useContext(MyContext);

    const [moveOpen, setMoveOpen] = useState(false);
    const [moveValue, setMoveValue] = useState(null);

    const [rangeOpen, setRangeOpen] = useState(false);
    const [rangeValue, setRangeValue] = useState(null);

    const [weight, onChangeWeight] = useState("");
    const [reps, onChangeReps] = useState("");
    const [selectedPO, setSelectedPO] = useState("2");
    const [alertVisible, setAlertVisible] = useState(false);
    const [newMove, setNewMove] = useState("");
    const [statusArr, setStatusArr] = useState([0, 0, 0]);
    const [submitReq, setSubmitReq] = useState(false);
    const dataSet = useRef([]);

    let today = new Date();
    today =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

    const modifyMountStatus = () => {
        firstMount.current = false;
    };

    const handleInt = () => {
        switch (intValue) {
            case 2:
                setRepRange([
                    { label: "1 rep max", value: [1, 1] },
                    { label: "2-4", value: [2, 4] },
                    { label: "5-7", value: [5, 7] },
                    { label: "8-10", value: [8, 10] },
                    { label: "11-13", value: [11, 13] },
                    { label: "14-16", value: [14, 16] },
                    { label: "17-19", value: [17, 19] },
                ]);
                break;
            case 3:
                setRepRange([
                    { label: "1 rep max", value: [1, 1] },
                    { label: "2-5", value: [2, 5] },
                    { label: "6-9", value: [6, 9] },
                    { label: "10-13", value: [10, 13] },
                    { label: "14-17", value: [14, 17] },
                    { label: "18-21", value: [18, 21] },
                ]);
                break;
            case 4:
                setRepRange([
                    { label: "1 rep max", value: [1, 1] },
                    { label: "2-6", value: [2, 6] },
                    { label: "7-11", value: [7, 11] },
                    { label: "12-16", value: [12, 16] },
                    { label: "17-21", value: [17, 21] },
                ]);
                break;
            case 5:
                setRepRange([
                    { label: "1 rep max", value: [1, 1] },
                    { label: "2-7", value: [2, 7] },
                    { label: "8-13", value: [8, 13] },
                    { label: "14-19", value: [14, 19] },
                    { label: "20-25", value: [20, 25] },
                ]);
                break;
            default:
                setRepRange([
                    { label: "1 rep max", value: [1, 1] },
                    { label: "2-5", value: [2, 5] },
                    { label: "6-9", value: [6, 9] },
                    { label: "10-13", value: [10, 13] },
                    { label: "14-17", value: [14, 17] },
                    { label: "18-21", value: [18, 21] },
                ]);
                break;
        }
    };
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
            const curData = [];
            for (const key of allKeys) {
                if (key != "movements") {
                    const d = await getData(key);
                    curData.push({ data: d, date: key });
                }
            }
            dataSet.current = curData;
            const savedMoves = await getData("movements");
            if (savedMoves.length != 0) {
                setMovement(savedMoves);
            }
            if (
                curData.length != 0 &&
                curData[curData.length - 1].date == today
            ) {
                setTracked(curData[curData.length - 1].data);
            }
        };
        loadData();

        firstMount.current = true;
    }, []);

    useEffect(() => {
        let newArr = [...statusArr];
        let changed = false;
        if (statusArr[0] == 0 && moveValue != null) {
            newArr[0] = 1;
            changed = true;
        } else if (statusArr[0] == 1 && moveValue == null) {
            newArr[0] = 0;
            if (!changed) changed = true;
        }
        if (statusArr[1] == 0 && reps != "") {
            newArr[1] = 1;
            if (!changed) changed = true;
        } else if (statusArr[1] == 1 && reps == "") {
            newArr[1] = 0;
            if (!changed) changed = true;
        }
        if (statusArr[2] == 0 && weight != "") {
            newArr[2] = 1;
            if (!changed) changed = true;
        } else if (statusArr[2] == 1 && weight == "") {
            newArr[2] = 0;
            if (!changed) changed = true;
        }
        if (changed) setStatusArr(newArr);
    }, [moveValue, reps, weight]);

    useEffect(() => {
        handleInt();
        if (rangeValue != null) {
            setRangeValue(null);
        }
    }, [intValue]);

    useEffect(() => {
        if (!firstMount.current) {
            storeData(today, tracked);
        }
    }, [tracked]);

    useEffect(() => {
        if (!firstMount.current) {
            storeData("movements", movement);
        }
        if (moveValue != null) {
            setMoveValue(null);
        }
    }, [movement]);

    useEffect(() => {
        setRangeValue(null);
    }, [selectedPO]);

    let suggPO = useMemo(() => {
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
                        return (
                            Number(tracked[index].weight) + Number(inc)
                        ).toString();
                    } else if (tracked[index].reps == rangeValue[0]) {
                        return (
                            Number(tracked[index].weight) - Number(inc)
                        ).toString();
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
                        return (
                            Number(curData[index].weight) + Number(inc)
                        ).toString();
                    } else if (curData[index].reps == rangeValue[0]) {
                        return (
                            Number(curData[index].weight) - Number(inc)
                        ).toString();
                    } else {
                        return curData[index].weight;
                    }
                }
            }
            return null; //not enough data
        }
    }, [rangeValue, tracked, moveValue, inc]);

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
            }
            setMoveOpen(false);
            setRangeOpen(false);
            onChangeReps("");
            onChangeWeight("");
            Keyboard.dismiss();

            firstMount.current = false;
            if (submitReq != false) {
                setSubmitReq(false);
            }
        } else {
            if (submitReq != true) {
                setSubmitReq(true);
            }
        }
    };

    const handleNewMoveSubmit = (move) => {
        if (move.trim().length !== 0) {
            setMovement([...movement, { label: move, value: move }]);
            setAlertVisible(false);
            setNewMove("");
            firstMount.current = false;
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
            <Image
                style={styles.logo}
                source={require("../assets/Advance-Logo.png")}
            />
            <View style={styles.new}>
                <View style={styles.inputs}>
                    <DropDownPicker
                        open={moveOpen}
                        value={moveValue}
                        items={movement}
                        setOpen={setMoveOpen}
                        setValue={setMoveValue}
                        setItems={setMovement}
                        containerStyle={styles.dropdown}
                        style={[
                            {
                                backgroundColor: "#efefef",
                                borderColor: "#ccc",
                            },
                            statusArr[0] == 0 &&
                                submitReq == true && {
                                    borderStyle: "dashed",
                                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                                    borderColor: "rgba(255, 0, 0, 0.5)",
                                },
                        ]}
                        dropDownContainerStyle={{
                            borderColor: "#ccc",
                            backgroundColor: "#efefef",
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
                            containerStyle={styles.dropdown}
                            style={{
                                backgroundColor: "#efefef",
                                borderColor: "#ccc",
                            }}
                            dropDownContainerStyle={{
                                backgroundColor: "#efefef",
                                borderColor: "#ccc",
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
                        style={[
                            styles.inputBox,
                            statusArr[1] == 0 &&
                                submitReq == true && {
                                    borderWidth: 1,
                                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                                    borderStyle: "dashed",
                                    borderColor: "rgba(255, 0, 0, 0.5)",
                                },
                        ]}
                        onChangeText={onChangeReps}
                        value={reps}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                    <Text>Reps</Text>
                </View>
                <View style={styles.inputs}>
                    <TextInput
                        style={[
                            styles.inputBox,
                            statusArr[2] == 0 &&
                                submitReq == true && {
                                    borderWidth: 1,
                                    borderStyle: "dashed",
                                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                                    borderColor: "rgba(255, 0, 0, 0.5)",
                                },
                        ]}
                        onChangeText={onChangeWeight}
                        value={weight}
                        placeholder={
                            selectedPO == 1
                                ? suggPO == null
                                    ? "Need data"
                                    : suggPO < 0
                                    ? "0 lbs"
                                    : suggPO + "lbs"
                                : "0lbs"
                        }
                        keyboardType="numeric"
                    />
                    <Text>Weight</Text>
                </View>
            </View>
            <View style={styles.options}>
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
                <Text style={{ fontSize: 12, margin: 5, marginTop: 0 }}>
                    (suggested weights appear in "weight" box)
                </Text>

                <View style={styles.buttonsContainer}>
                    <TouchableHighlight
                        onPress={() => setAlertVisible(true)}
                        style={styles.buttonTouchableContainer}
                    >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>New Movement</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => handleSubmit(moveValue, weight, reps)}
                        style={styles.buttonTouchableContainer}
                    >
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>

            <View style={styles.table}>
                <TodayTable
                    data={tracked}
                    setTracked={setTracked}
                    modifyMountStatus={modifyMountStatus}
                />
            </View>
            <Dialog.Container visible={alertVisible}>
                <Dialog.Title>Add New Movement</Dialog.Title>
                <Dialog.Description>
                    Custom movements will be stored on "movement" drop down.
                </Dialog.Description>
                <Dialog.Input value={newMove} onChangeText={setNewMove} />
                <Dialog.Button
                    label="Cancel"
                    onPress={() => setAlertVisible(false)}
                />
                <Dialog.Button
                    label="Submit"
                    onPress={() => handleNewMoveSubmit(newMove)}
                />
            </Dialog.Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    logo: {
        height: "5%",
        width: "45%",
        resizeMode: "stretch",
    },
    new: {
        width: "100%",
        height: "17%",
        flexDirection: "row",
        zIndex: 1,
    },
    inputs: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputBox: {
        height: "45%",
        width: "90%",
        margin: 12,
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#efefef",
    },
    dropdown: {
        marginVertical: 11,
        width: "90%",
    },
    options: {
        width: "100%",
        height: "14%",
    },
    RadioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        height: "40%",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonTouchableContainer: {
        alignSelf: "center",
        marginHorizontal: 5,
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
        fontWeight: "600",
        letterSpacing: 0.25,
        color: "white",
    },
    table: {
        height: "59%",
        width: "100%",
    },
});
