import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const credentials = {
  admin: { password: 'admin', role: 'admin' },
  'popeye khzema': { password: 'popeye khzema', role: 'vender', store: 'khzema' },
  'popeye sahloul': { password: 'popeye sahloul', role: 'vender', store: 'sahloul' },
};

export default function LoginScreen() {
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Check if credentials exist
    if (!credentials[address]) {
      Alert.alert('Login Failed', 'Invalid credentials');
      return;
    }

    // Check if password matches
    if (credentials[address].password !== password) {
      Alert.alert('Login Failed', 'Invalid credentials');
      return;
    }

    // Login successful - navigate based on role
    const user = credentials[address];
    
    if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'vender') {
      router.push(`/vender/dashboard?store=${user.store}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Store Management</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Available Logins:</Text>
            <Text style={styles.helpText}>• Admin: admin / admin</Text>
            <Text style={styles.helpText}>• Khzema Store: popeye khzema / popeye khzema</Text>
            <Text style={styles.helpText}>• Sahloul Store: popeye sahloul / popeye sahloul</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 