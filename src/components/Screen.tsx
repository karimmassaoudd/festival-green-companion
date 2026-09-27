import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

export function Screen({ icon, title, description }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={48} color="#2E7D32" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FCF9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderRadius: 44,
    backgroundColor: '#E3F2E4',
  },
  title: {
    marginBottom: 12,
    color: '#183A1D',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    color: '#536356',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
