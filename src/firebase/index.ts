import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  let cred;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      cred = cert(serviceAccount);
    } catch (error) {
      console.warn("Invalid FIREBASE_SERVICE_ACCOUNT JSON. Falling back to ADC.");
    }
  }

  const appOptions: any = {
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'nidalum-bot.appspot.com'
  };
  
  if (cred) {
    appOptions.credential = cred;
  }

  initializeApp(appOptions);
}

export const db = getFirestore();
export const bucket = getStorage().bucket();
