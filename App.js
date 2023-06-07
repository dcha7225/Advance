import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Today from "./app/screens/Today";
import Chart from "./app/screens/ChartsScreen";
import Journal from "./app/screens/Journal";
import Settings from "./app/screens/Settings";

import { MyContextProvider } from "./app/components/ContextProvider";
import ErrorBoundary from "./app/components/ErrorHandler";

const Tab = createBottomTabNavigator();

const todayName = "Today";
const journalName = "Journal";
const chartName = "Charts";
const settingsName = "Settings";

export default function App() {
    return (
        <ErrorBoundary>
            <MyContextProvider>
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
                        <Tab.Screen name={journalName} component={Journal} />
                        <Tab.Screen name={settingsName} component={Settings} />
                    </Tab.Navigator>
                </NavigationContainer>
            </MyContextProvider>
        </ErrorBoundary>
    );
}
