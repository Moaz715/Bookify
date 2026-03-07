import { CartContext } from "../context/CartContext";
import { useContext } from "react";


export const useAuthContext = () => {
    const context = useContext(CartContext);

    if(!context){
        throw Error('useAuthContext must be used inside a AuthContextProvider');
    }

    return context;
}