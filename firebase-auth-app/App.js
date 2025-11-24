import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email/Password Sign Up
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully!');
      resetForm();
    } catch (error) {
      let errorMessage = 'An error occurred during sign up';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password Sign In
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Signed in successfully!');
      resetForm();
    } catch (error) {
      let errorMessage = 'Invalid email or password';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      Alert.alert('Sign In Error', errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Sign In (Note: Requires additional setup with Expo)
  const handleGoogleSignIn = async () => {
    Alert.alert(
      'Google Sign In',
      'Google Sign In requires additional configuration:\n\n' +
      '1. Install @react-native-google-signin/google-signin\n' +
      '2. Configure OAuth 2.0 in Firebase Console\n' +
      '3. Add Google Sign In credentials to your app\n\n' +
      'For this demo, please use Email/Password authentication.',
      [{ text: 'OK' }]
    );
  };

  // Password Reset
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email');
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // Reset form
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285f4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // User is authenticated - Show Profile
  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {user.uid}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email Verified:</Text>
              <Text style={styles.infoValue}>
                {user.emailVerified ? '✓ Yes' : '✗ No'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Provider:</Text>
              <Text style={styles.infoValue}>
                {user.providerData[0]?.providerId || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Sign In:</Text>
              <Text style={styles.infoValue}>
                {new Date(user.metadata.lastSignInTime).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // User is not authenticated - Show Login/Signup
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View style={styles.header}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Firebase Auth</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          )}

          {isLogin && (
            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, authLoading && styles.buttonDisabled]}
            onPress={isLogin ? handleSignIn : handleSignUp}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  authContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#4285f4',
    fontSize: 14,
    fontWeight: '600',
    marginTop: -10,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4285f4',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4285f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e1e4e8',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285f4',
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  toggleText: {
    color: '#666',
    fontSize: 15,
  },
  toggleLink: {
    color: '#4285f4',
    fontSize: 15,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 2,
    textAlign: 'right',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
