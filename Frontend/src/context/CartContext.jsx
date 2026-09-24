import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const additem = (newitem) =>{
        setCart(prevCart => {
            const exists = prevCart.find(item => item._id === newitem._id)
            if(exists){
                return prevCart.map(item =>{
                    if(item._id === newitem._id){
                        return { ...item, quantity: item.quantity + newitem.quantity}
                    }else{
                        return item
                    }
                })
            }else{
                return [...prevCart, newitem]
            }
        });
    }

    const removeitem = (itemId) =>{
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    }

    const increment = (itemId) =>{
        setCart(prevCart => prevCart.map(item =>
            item._id === itemId ? {...item, quantity: item.quantity + 1} : item
        ));
    }

    const decrement = (itemId) =>{
        setCart(prevCart => prevCart.map(item =>
            item._id === itemId && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item
        ));
    }

    const clearCart = () =>{
        setCart([]);
    }

    return (
        <CartContext.Provider value={{ cart, additem, removeitem, increment, decrement, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}