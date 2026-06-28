import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookForm from "../components/BookForm";
import api from "../utils/api";
import { toast } from 'react-toastify';

const EditBook = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [initialBook, setInitialBook] = useState(null);


    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await api.get(`/api/books/${id}`);
                setInitialBook(res.data);
            } catch (error) {
                toast.error("Could not load book details.");
            }
        };
        fetchBook();
    }, [id]);

    const handleEditBook = async (bookData) => {
        try {
            const res = await api.put(`/api/books/${id}`, bookData);
            toast.success("Book updated successfully!");
            navigate(`/books/${res.data._id}`);
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to update book";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    if (!initialBook) return <div>Loading book data...</div>;

    return (
        <div className="edit-book-page">
            <h2>Edit Book</h2>
            <BookForm initialBook={initialBook} onSubmit={handleEditBook} error={error} />
        </div>
    );
}

export default EditBook;