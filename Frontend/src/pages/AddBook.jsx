import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookForm from "../components/BookForm";

const AddBook = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleCreateBook = async (bookData) => {
        const res = await fetch("/api/books", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(bookData)
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