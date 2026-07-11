import fs from 'fs';
import path from 'path';
import { initializeApp, cert, App } from 'firebase-admin/app';

const serviceAccountPath = path.join(__dirname, '../../config/firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const firebaseApp: App = initializeApp({
  credential: cert(serviceAccount),
});

export default firebaseApp;
