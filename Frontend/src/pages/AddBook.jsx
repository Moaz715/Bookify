import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookForm from "../components/BookForm";
import api from "../utils/api";
import { toast } from 'react-toastify';

const AddBook = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleCreateBook = async (bookData) => {
        const formData = new FormData();
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('description', bookData.description);
        formData.append('price', bookData.price);
        formData.append('genre', bookData.genre);
        formData.append('stock', bookData.stock);
        
        if (bookData.image) {
            formData.append('image', bookData.image);
        }

        try {
            const res = await api.post("/api/books", formData);
            toast.success("Book created successfully!");
            navigate(`/books/${res.data._id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to create book";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="add-book-page">
            <h2>Add New Book</h2>
            <BookForm onSubmit={handleCreateBook} error={error} />
        </div>
    );
}

export default AddBook;