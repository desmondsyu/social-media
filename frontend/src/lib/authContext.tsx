import {createContext, useState, useEffect, ReactNode, useContext} from "react";
import {login, validate} from "./actions";
import {LoginProp, ValidateProp} from "./propinterfaces";
import {setCookie, getCookie, removeCookie} from 'typescript-cookie';

interface AuthContextType {
    isAuthenticated: boolean | undefined;
    login: (formData: LoginProp) => Promise<string>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

    // Update useEffect to redirect when authenticated
    useEffect(() => {
        const checkAuth = async () => {
            const token = getCookie('token');
            const username = sessionStorage.getItem("curUn");

            if (token && username) {
                try {
                    const validateForm: ValidateProp = {
                        token: token,
                        username: username
                    };
                        const response = await validate(validateForm);

                        if (response) {
                            setIsAuthenticated(true);
                        } else {
                            setIsAuthenticated(false);
                        }

                } catch (err) {
                    console.error("Validation error:", err);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }

        };

        checkAuth();
    }, []);

    useEffect(() => {
        console.log("Authentication State Changed:", isAuthenticated);
    }, [isAuthenticated]);

    const handleLogin = async (formData: LoginProp): Promise<string> => {
        try {
            const response = await login(formData);
            if (response) {
                setCookie('token', response, {expires: 1, path: "/"});
                sessionStorage.setItem("curUn", formData.username);
                setIsAuthenticated(true);
                console.log(response);
                return response;
            }
            return "unable to login";
        } catch (error: any) {
            console.error("Error during login:", error.message);
            return "unable to login";
        }
    };

    const handleLogout = () => {
        removeCookie("token");
        sessionStorage.clear();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login: handleLogin, logout: handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
