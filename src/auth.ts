import { AsyncStorage } from "react-native";

class Auth {

    /**
     * Authenticate a user. Save a token string in Local Storage
     *
     * @param {string} token
     */
    static async authenticateUser(token, userId) {
        try {
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("userId", userId);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }

    /**
     * Check if a user is authenticated - check if a token is saved in Local Storage
     *
     * @returns {boolean}
     */
    static async isUserAuthenticated(): Promise<boolean> {
        let token = null;
        try {
            token = await AsyncStorage.getItem("token") || null;
        } catch (error) {
            console.log(error.message);
        }
        return token !== null;
    }

    /**
     * Deauthenticate a user. Remove a token from Local Storage.
     *
     */
    static async deauthenticateUser() {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userId");
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Get a token value.
     *
     * @returns {string}
     */

    static async getToken() {
        let token = null;
        try {
            token = await AsyncStorage.getItem("token") || null;
        } catch (error) {
            console.log(error.message);
        }
        return token;
    }

    /**
     * Get a user id.
     *
     * @returns {string}
     */

    static async getUserId() {


        let userId = null;

        
        try {
            userId = await AsyncStorage.getItem("userId") || null;
        } catch (error) {
            console.log(error.message);
        }
        return userId;
    }

    static async init(data) {
        console.log('init!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',data);
        
        try {
            await AsyncStorage.setItem("identity", JSON.stringify(data));
            Auth.authenticateUser(data.token, data.userId);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }

    // static init(data = null) {
    //     if (typeof document !== "undefined") {
    //         const identity = document.getElementById("identity");
    //         if (data === null) {
    //             const html = identity.innerHTML;
    //             const body = html && html.length > 0 ? html : "{}";
    //             data = JSON.parse( body );
    //             if (data.hasOwnProperty("token") && data.token.length > 0) {
    //                 Auth.authenticateUser(data.token);
    //             }
    //         } else {
    //             identity.innerHTML = JSON.stringify(data);
    //         }
    //         return data;
    //     }
    //     return null;
    // }

}

export default Auth;