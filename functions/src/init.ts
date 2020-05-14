import * as admin from 'firebase-admin';

admin.initializeApp();

// in all functions, import and use this already initialized adminSdk instead of directly importing admin from firebase-admin!
export const adminSdk = admin;
export const REGION = 'europe-west1';
