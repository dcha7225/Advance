import react, { Component } from "react";
import { Alert } from "react-native";
import { Text, SafeAreaView } from "react-native";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });

        Alert.alert("Error", "An error has occurred. Please try again later.", [
            { text: "OK", onPress: () => this.setState({ hasError: false }) },
        ]);
    }

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaView>
                    <Text>Oops! Something went wrong.</Text>
                </SafeAreaView>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
