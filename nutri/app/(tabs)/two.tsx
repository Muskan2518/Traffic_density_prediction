import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { useRouter } from 'expo-router';  // Import useRouter for navigation

export default function TabTwoScreen() {
  const router = useRouter(); // Initialize router

  const handleSignOut = () => {
    if (FIREBASE_AUTH.currentUser) {
      FIREBASE_AUTH.signOut()
        .then(() => {
          console.log("Signed out successfully!");
          router.replace('/login'); // Navigate to login page
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    } else {
      console.log("No user is currently signed in.");
    }
  };

  const handleDeleteAccount = () => {
    if (FIREBASE_AUTH.currentUser) {
      FIREBASE_AUTH.currentUser.delete()
        .then(() => {
          console.log("Account deleted successfully!");
          router.replace('/login'); // Redirect to login after account deletion
        })
        .catch((error) => {
          console.error("Error deleting account: ", error);
        });
    } else {
      console.log("No user is currently signed in.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Delete Account" onPress={handleDeleteAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
