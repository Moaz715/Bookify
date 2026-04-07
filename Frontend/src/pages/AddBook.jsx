import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookForm from "../components/BookForm";

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

        const res = await fetch("/api/books", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
            body: formData
        });

        const json = await res.json();

        if (res.ok) {
            navigate(`/books/${json._id}`);
        } else {
            setError(json.error);
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