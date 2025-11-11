import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  GithubAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { auth } from "../config/firebase";

// Penting untuk Expo Auth Session
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

// GitHub OAuth endpoints
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/YOUR_GITHUB_CLIENT_ID`,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // GitHub OAuth Configuration
  const redirectUri = makeRedirectUri({
    scheme: "expensemanager",
    path: "redirect",
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "Ov23lisfCdcaUQqt0GkA",
      scopes: ["identity", "user:email"],
      redirectUri: redirectUri,
    },
    discovery
  );

  console.log("GitHub OAuth Redirect URI:", redirectUri);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.email || "No user");
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle GitHub Sign-In Response
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      console.log("GitHub Sign-In success, exchanging code for token...");

      // Exchange code for access token
      exchangeCodeForToken(code);
    } else if (response?.type === "error") {
      console.error("GitHub Sign-In error:", response.error);
    } else if (response?.type === "cancel") {
      console.log("GitHub Sign-In cancelled by user");
    }
  }, [response]);

  async function exchangeCodeForToken(code: string) {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: "Ov23lisfCdcaUQqt0GkA",
            client_secret: "3b227e408f2b9e690c93abe24b97e65d09387544",
            code: code,
            redirect_uri: redirectUri,
          }),
        }
      );

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      console.log("Access token received, signing in to Firebase...");

      // Create Firebase credential
      const credential = GithubAuthProvider.credential(accessToken);

      // Sign in with credential
      const userCredential = await signInWithCredential(auth, credential);
      console.log("Firebase sign-in successful:", userCredential.user.email);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGitHub() {
    try {
      if (Platform.OS === "web") {
        // Untuk Web - gunakan popup
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
        console.log("GitHub Sign-In (Web) successful");
      } else {
        // Untuk Mobile (Expo Go) - gunakan browser-based OAuth
        console.log("Opening GitHub Sign-In browser...");
        const result = await promptAsync();

        if (result.type === "cancel") {
          console.log("GitHub Sign-In cancelled by user");
          throw new Error("Sign-in cancelled");
        }

        // Response akan ditangani oleh useEffect di atas
      }
    } catch (error: any) {
      console.error("GitHub Sign-In Error:", error);
      throw error;
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGitHub,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
