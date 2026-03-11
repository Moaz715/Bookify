import { createContext, useState, useReducer } from "react";

export const CartContext = createContext();

export const cartReducer = (state, action) => {
    if (action.type == 'ADD_BOOK') {
        const exists = state.cart.find(book => book._id === action.payload._id);

        if (exists) {
            return {
                cart: state.cart.map(book =>
                    book._id === action.payload._id
                        ? { ...book, quantity: book.quantity + action.payload.quantity }
                        : book
                )
            };
        } else {
            return { cart: [...state.cart, action.payload] };
        }
    } else if (action.type == 'REMOVE_BOOK') {
        return { cart: state.cart.filter(book => book._id !== action.payload._id) };
    } else if (action.type == 'INCREMENT') {
        return {
            cart: state.cart.map(book => book._id === action.payload._id ? { ...book, quantity: book.quantity + 1 } : book)
        }
    } else if (action.type === 'DECREMENT') {
        return {
            cart: state.cart.map(book => book._id === action.payload._id && book.quantity > 1 ? { ...book, quantity: book.quantity - 1 } : book)
        }
    } else if (action.type === 'CLEAR') {
        return {
            cart: []
        }
    }
    else {
        return state;
    }
}

export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        cart: []
    });

    return (
        <CartContext.Provider value={{ ...state, dispatch }}>
            {children}
        </CartContext.Provider>
    )

}

