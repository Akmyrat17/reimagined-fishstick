import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';

export const firebaseProvider = {
    provide: 'FIREBASE_APP',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const logger = new Logger('FirebaseProvider');

        // Check if already initialized
        if (admin.apps.length > 0) {
            logger.log('Firebase app already initialized');
            return admin.app();
        }

        try {
            // Load service account from JSON file
            const serviceAccountPath = path.join(process.cwd(), 'cred-fcm.json');
            const serviceAccount = require(serviceAccountPath);

            const initializeApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            logger.log('✅ Firebase initialized successfully from cred-fcm.json');
            return initializeApp;
        } catch (error: any) {
            logger.error('❌ Error while initializing firebase');
            logger.error(error.message);

            // Fallback to environment variables if JSON file fails
            logger.warn('Attempting to initialize from environment variables...');
            try {
                const project_id = configService.get('FIREBASE_PROJECT_ID');
                const client_email = configService.get('FIREBASE_CLIENT_EMAIL');
                const private_key = configService
                    .get('FIREBASE_PRIVATE_KEY')
                    ?.replace(/\\n/g, '\n');

                if (!project_id || !client_email || !private_key) {
                    throw new Error('Missing Firebase credentials in environment variables');
                }

                const initializeApp = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: project_id,
                        clientEmail: client_email,
                        privateKey: private_key,
                    }),
                });

                logger.log('✅ Firebase initialized from environment variables');
                return initializeApp;
            } catch (envError) {
                logger.error('❌ Failed to initialize from environment variables');
                logger.error(envError.message);
                return null;
            }
        }
    },
};