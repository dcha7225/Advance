import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Today from "./app/screens/Today";
import Chart from "./app/screens/ChartsScreen";
import Journal from "./app/screens/Journal";
const Tab = createBottomTabNavigator();

const todayName = "Today";
const journalName = "Journal";
const chartName = "Charts";

export default function App() {
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

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={todayName}
                screenOptions={({ route }) => ({
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "grey",
                    headerShown: false,

                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === todayName) {
                            iconName = focused ? "today" : "today-outline";
                        } else if (rn === journalName) {
                            iconName = focused ? "journal" : "journal-outline";
                        } else if (rn === chartName) {
                            iconName = focused
                                ? "bar-chart"
                                : "bar-chart-outline";
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
                <Tab.Screen name={chartName} component={Chart} />
                <Tab.Screen name={todayName} component={Today} />
                <Tab.Screen name={journalName} component={Journal} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
