import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";
import api from "../../services/api";

import logoImage from "../../assets/logo.png";
import styles from "./styles";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  function navigateToIncidentDetail(incident) {
    navigation.navigate("Incident detail", { incident });
  }

  async function loadIncidents() {
    if (loading) {
      return;
    }

    if (totalIncidents > 0 && incidents.length === totalIncidents) {
      return;
    }

    setLoading(true);

    const response = await api.get("/incidents", {
      params: {
        page
      }
    });

    setLoading(false);
    setIncidents([...incidents, ...response.data]);
    setTotalIncidents(response.headers["x-total-count"]);
    setPage(page + 1);
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} />
        <Text style={styles.headerText}>
          Total de{" "}
          <Text style={styles.headerTextBold}>{totalIncidents} casos</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo e salve o dia
      </Text>

      <FlatList
        style={styles.incidentsList}
        data={incidents}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>Caso:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToIncidentDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={17} color="#e02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
