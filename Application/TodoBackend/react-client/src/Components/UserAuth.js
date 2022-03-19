import { createAuthProvider } from 'react-token-auth';

export const { useAuth, authFetch, login, logout } = createAuthProvider({
    getAccessToken: session => session.accessToken,
    storage: sessionStorage,
    onUpdateToken: token =>
        fetch('/update-token', {
            method: 'POST',
            body: token.refreshToken,
        }).then(r => r.json()),
});