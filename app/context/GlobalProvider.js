import { useContext, createContext, useState, useEffect } from 'react';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    return (
        <GlobalContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser, loading,}}>
            {children}
        </GlobalContext.Provider>
    )
}


export default GlobalProvider;
