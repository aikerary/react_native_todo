import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';

const TodoStats = ({ stats }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.completedColor]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.pendingColor]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
        
        <Text style={styles.progressLabel}>
          Completion: {stats.completionRate}%
        </Text>
        <ProgressBar 
          progress={stats.completionRate / 100} 
          color="#6200ee" 
          style={styles.progressBar} 
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 12,
    elevation: 4
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: 14,
    color: '#666'
  },
  completedColor: {
    color: '#4CAF50'
  },
  pendingColor: {
    color: '#FFA000'
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666'
  },
  progressBar: {
    height: 8,
    borderRadius: 4
  }
});

export default TodoStats;
