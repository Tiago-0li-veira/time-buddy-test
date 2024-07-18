import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

//

function App() {
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeZoneList, setTimeZoneList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("./timezones.json");
      setTimezones(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchTimeZone = async () => {
    try {
      const res = await axios.get(
        `http://worldtimeapi.org/api/timezone/${selectedTimezone}`
      );
      if (!timeZoneList.find((tz) => tz.timezone === res.data.timezone)) {
        setTimeZoneList([...timeZoneList, res.data]);
        console.log(res.data);
      } else {
        Alert.alert("Duplicate Timezone", "This timezone is already added.");
      }
      setSearchQuery("");
      setSelectedTimezone("");
    } catch (err) {
      Alert.alert("Error", "Failed to fetch timezone data.");
    }
  };

  const renderItem = ({ item }) => {
    const backgroundColor = item === selectedTimezone ? "#96B2FD" : "#fff";
    const words = item.split("/");
    const zone = words[words.length - 1];
    const big_zone = words.length === 3 ? `${words[1]}, ${words[0]}` : words[0];

    return (
      <Pressable onPress={() => setSelectedTimezone(item)}>
        <Text style={[styles.item, { backgroundColor }]}>
          {zone} - {big_zone}
        </Text>
      </Pressable>
    );
  };

  const filteredTimezones = timezones.filter((timezone) =>
    timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parseDateTime = (str) => {
    const date = str.slice(0, 10);
    const time = str.slice(11, 19);
    return `${date} ${time}`;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search timezone"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <View style={styles.listContainer}>
        {searchQuery !== "" && (
          <FlatList
            data={filteredTimezones}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            style={styles.list}
          />
        )}
      </View>
      <Pressable
        onPress={fetchTimeZone}
        disabled={selectedTimezone === ""}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? "#96B2FD" : "#007BFF",
          },
          selectedTimezone === "" && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
      {timeZoneList.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected Timezones:</Text>
          {timeZoneList.map((tz, index) => (
            <Text key={index} style={styles.selectedItem}>
              {parseDateTime(tz.datetime)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  list: {
    width: "100%",
  },
  item: {
    padding: 15,
    fontSize: 18,
    marginVertical: 8,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: "#AAA",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  selectedContainer: {
    marginTop: 20,
    width: "100%",
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  selectedItem: {
    fontSize: 16,
    textAlign: "center",
    padding: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default App;
