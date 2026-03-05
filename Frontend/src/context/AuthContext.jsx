import {createContext, useReducer} from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) =>{
    if(action.type == 'LOGIN'){
        return {user: action.payload};
    }else if(action.type == 'LOGOUT'){
        return {user: null};
    }else{
        return state;
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, []);

    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}