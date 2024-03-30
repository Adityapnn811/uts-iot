"use server";
import * as firebase from "firebase-admin";
import { getApp, getApps } from "firebase-admin/app";
import { initializeApp } from "firebase/app";
import { env } from "process";

const firebaseConfig = {
  apiKey: "AIzaSyApbieqgY8TVzY3g4soCsPOdvQbLx2j8Ww",

  authDomain: "uts-iot-f3d60.firebaseapp.com",

  projectId: "uts-iot-f3d60",

  storageBucket: "uts-iot-f3d60.appspot.com",

  messagingSenderId: "527664054687",

  appId: "1:527664054687:web:489d5f2c2ad71bce81bdaa",
};

const serviceAccountConfig = {
  type: env.TYPE,
  project_id: env.PROJECT_ID,
  private_key_id: env.PRIVATE_KEY_ID,
  private_key: env.PRIVATE_KEY,
  client_email: env.CLIENT_EMAIL,
  client_id: env.CLIENT_ID,
  auth_uri: env.AUTH_URI,
  token_uri: env.TOKEN_URI,
  auth_provider_x509_cert_url: env.AUTH_PROVIDER,
  client_x509_cert_url: env.CLIENT_CERT_URL,
  universe_domain: env.UNIVERSE_DOMAIN,
};

export async function initializeAdmin() {
  if (getApps().length > 0) return getApp();
  return firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: serviceAccountConfig.project_id,
      clientEmail: serviceAccountConfig.client_email,
      privateKey: serviceAccountConfig.private_key,
    }),
  });
}

export async function initializeFirebase() {
  return initializeApp(firebaseConfig);
}
