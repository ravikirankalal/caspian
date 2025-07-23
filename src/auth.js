import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
}

export function logout() {
    return signOut(auth);
}

export function watchAuthState(cb) {
    return onAuthStateChanged(auth, cb);
}
