import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
    View,
    ImageBackground,
    TouchableHighlight,
    StyleSheet,
    Text,
} from "react-native";

import Today from "./app/screens/Today";
import Chart from "./app/screens/ChartsScreen";
import Journal from "./app/screens/Journal";
import Settings from "./app/screens/Settings";

import { MyContextProvider } from "./app/components/ContextProvider";
import { getData, storeData } from "./AsyncStor";
import ErrorBoundary from "./app/components/ErrorHandler";

const Tab = createBottomTabNavigator();

const todayName = "Today";
const journalName = "Journal";
const chartName = "Charts";
const settingsName = "Settings";

const imagePaths = {
    0: require("./app/assets/tutorial/0.png"),
    1: require("./app/assets/tutorial/1.png"),
    2: require("./app/assets/tutorial/2.png"),
    3: require("./app/assets/tutorial/3.png"),
    4: require("./app/assets/tutorial/4.png"),
    5: require("./app/assets/tutorial/5.png"),
    6: require("./app/assets/tutorial/6.png"),
    7: require("./app/assets/tutorial/7.png"),
    8: require("./app/assets/tutorial/8.png"),
    9: require("./app/assets/tutorial/9.png"),
    10: require("./app/assets/tutorial/10.png"),
    11: require("./app/assets/tutorial/11.png"),
    12: require("./app/assets/tutorial/12.png"),
    13: require("./app/assets/tutorial/13.png"),
    14: require("./app/assets/tutorial/14.png"),
    15: require("./app/assets/tutorial/15.png"),

    // Add more entries for other tutPage values as needed
};

export default function App() {
    const [d, setD] = useState([1]);
    const [tutPage, setTutPage] = useState(0);
    useEffect(() => {
        const loadData = async () => {
            temp = await getData("tutorial");
            setD(temp);
        };
        loadData();
    }, []);

    const handleIncrement = () => {
        setTutPage((prevTutPage) => prevTutPage + 1);
    };
    const handleDecrement = () => {
        setTutPage((prevTutPage) => prevTutPage - 1);
    };
    const handleEnd = () => {
        setD([1]);
        storeData("tutorial", [1]);
    };
    return (
        <ErrorBoundary>
            <MyContextProvider>
                {d.length == 0 ? (
                    <View style={{ flex: 1 }}>
                        <ImageBackground
                            source={imagePaths[tutPage]}
                            style={{
                                flex: 1,
                                justifyContent: "center",
                            }}
                            resizeMode="stretch"
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <TouchableHighlight
                                    onPress={() => {
                                        if (tutPage > 0) {
                                            handleDecrement();
                                        }
                                    }}
                                    style={[
                                        styles.buttonTouchableContainer,
                                        tutPage <= 0 && { opacity: 0 },
                                    ]}
                                >
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>B</Text>
                                        <Text style={styles.buttonText}>a</Text>
                                        <Text style={styles.buttonText}>c</Text>
                                        <Text style={styles.buttonText}>k</Text>
                                    </View>
                                </TouchableHighlight>
                                {tutPage < 15 ? (
                                    <TouchableHighlight
                                        onPress={handleIncrement}
                                        style={styles.buttonTouchableContainer}
                                    >
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>
                                                N
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                e
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                x
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                t
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                ) : (
                                    <TouchableHighlight
                                        onPress={handleEnd}
                                        style={styles.buttonTouchableContainer}
                                    >
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>
                                                F
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                i
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                n
                                            </Text>

                                            <Text style={styles.buttonText}>
                                                i
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                s
                                            </Text>
                                            <Text style={styles.buttonText}>
                                                h
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                )}
                            </View>
                        </ImageBackground>
                    </View>
                ) : (
                    <NavigationContainer>
                        <Tab.Navigator
                            initialRouteName={todayName}
                            screenOptions={({ route }) => ({
                                tabBarActiveTintColor: "#4b4c4d",
                                tabBarInactiveTintColor: "grey",
                                headerShown: false,

                                tabBarIcon: ({ focused, color, size }) => {
                                    let iconName;
                                    let rn = route.name;

                                    if (rn === todayName) {
                                        iconName = focused
                                            ? "today"
                                            : "today-outline";
                                    } else if (rn === journalName) {
                                        iconName = focused
                                            ? "journal"
                                            : "journal-outline";
                                    } else if (rn === chartName) {
                                        iconName = focused
                                            ? "bar-chart"
                                            : "bar-chart-outline";
                                    } else if (rn === settingsName) {
                                        iconName = focused
                                            ? "settings"
                                            : "settings-outline";
                                    }

                                    return (
                                        <Ionicons
                                            name={iconName}
                                            size={size}
                                            color={color}
                                        />
                                    );
                                },
                            })}
                        >
                            <Tab.Screen name={todayName} component={Today} />
                            <Tab.Screen name={chartName} component={Chart} />
                            <Tab.Screen
                                name={journalName}
                                component={Journal}
                            />
                            <Tab.Screen
                                name={settingsName}
                                component={Settings}
                            />
                        </Tab.Navigator>
                    </NavigationContainer>
                )}
            </MyContextProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    buttonTouchableContainer: {
        alignSelf: "center",
        marginHorizontal: 5,
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "#e84b4b82",
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "600",
        letterSpacing: 0.25,
        color: "white",
    },
});
