import { useCallback, useEffect, useState } from "react";
import { updateToken } from "../APIs/Superuser/network.api";
export let _token =
    JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH") || "{}") || null;
const isToken = () => _token.accessToken;
/**
 * @info: This utility function parses the jwt token extracting the exp, iat and user information
 * @param: accessToken => Pass the access token inside this function
 * @return: JSON OBJECT || NULL
 */
const parseJwt = (accessToken) => {
    try {
        return JSON.parse(window.atob(accessToken.split(".")[1], "base64"));
    } catch (e) {
        return null;
    }
};

/**
 * @info: This utility function checks wheather the access token has expired or not using the exp property of access token
 * @param: jwtaccessToken => Pass the access token inside this function
 * @return: true || NULL
 */
const isExpired = (jwtaccessToken) => {
    if (!jwtaccessToken) return null;
    const jwt = parseJwt(jwtaccessToken);
    return (jwt && jwt.exp && jwt.exp * 1000 < Date.now()) || null;
};

/**
 * @info: This function sets the token for new user OR updates the token for existing user
 * @param: Token => Pass the token inside this function in the format: {accessToken: String, refreshToken: String}
 * @return: true or false
 */
const setToken = (token) => {
    if (!token) token = {};
    if (token && token.accessToken)
        localStorage.setItem("REACT_TOKEN_AUTH", JSON.stringify(token));
    else localStorage.removeItem("REACT_TOKEN_AUTH");
    _token = token;
    return isLoggedIn();
};

/**
 * @info: This function gets the token for new user (returning null) OR for existing user.
 * Simultaneously checks wheather token is expired. If so, renews before getting the token
 * @return: true or false
 */
const getToken = async () => {
    if (!isToken()) return {};
    if (isExpired(_token.accessToken)) {
        _token = await updateToken(_token.refreshToken)
            .then((r) => r.data)
            .catch((e) => null);
    }
    return _token;
};

const isLoggedIn = () => {
    if (!isToken()) return false;
    if (isExpired(_token.accessToken)) {
        setToken(null);
        return false;
    }
    return !!_token && !!_token.accessToken;
};

const getUser = () => {
    if (!isToken()) return null;
    return parseJwt(_token.accessToken);
};
export const useAuth = () => {
    const [isLogged, setIsLogged] = useState(isLoggedIn());
    const [user, setReactUser] = useState();
    const login = (newToken) => setIsLogged(setToken(newToken));
    const logout = () => setIsLogged(setToken(null));
    const getLoggedStatus = useCallback(
        async () => setIsLogged(setToken(await getToken())),
        []
    );

    useEffect(() => {
        setReactUser(getUser());
    }, [isLogged]);

    useEffect(() => {
        let intervalID = setInterval(() => {
            getLoggedStatus();
            if (!isLogged) clearInterval(intervalID);
        }, 120000);
        return () => clearInterval(intervalID);
    }, [getLoggedStatus, isLogged]);

    return [isLogged, login, logout, user];
};
