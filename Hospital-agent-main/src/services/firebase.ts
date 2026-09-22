// We re-export from our central firebase configuration to prevent double-initialization
// of the Firebase App, which causes errors. This file fulfills the requested service path.
import { db } from '../lib/firebase';

export { db };
