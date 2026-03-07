import { createContext, useState } from "react";

export const BookContext = createContext();

export const cartReducer = (state, action) =>{
    if(action.type == 'ADD_BOOK'){
        const exists = state.cart.find(book=> book._id === action.payload._id);

        if(exists){
            return {
                    cart: state.cart.map(book => 
                        book._id === action.payload._id 
                            ? { ...book, quantity: book.quantity + 1 } 
                            : book
                    )
                };
        }else{
            return {cart: [...state.cart, {...action.payload, qty: 1}]};
        }
    }else if(action.type == 'REMOVE_BOOK'){
        return {cart: state.cart.filter(book => book._id !== action.payload._id)};
    }else{
        return state;
    }
}

export const CartContextProvider = (props) =>{
    const [state, dispatch] = useReducer(cartReducer, { 
        cart: [] 
    });

    return(
        <CartContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CartContext.Provider>
    )

}

