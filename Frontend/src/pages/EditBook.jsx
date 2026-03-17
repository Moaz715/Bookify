import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import BookForm from "../components/BookForm";

const EditBook = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [initialBook, setInitialBook] = useState(null);


    useEffect(() => {
        const fetchBook = async () => {
            const res = await fetch(`/api/books/${id}`);
            const json = await res.json();
            if (res.ok) {
                setInitialBook(json);
            }
        };
        fetchBook();
    }, [id]);

    const handleEditBook = async (bookData) => {
        const res = await fetch(`/api/books/${id}`, {
            method: 'PUT',
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

    if (!initialBook) return <div>Loading book data...</div>;

    return (
        <div className="edit-book-page">
            <h2>Edit Book</h2>
            <BookForm initialBook={initialBook} onSubmit={handleEditBook} error={error} />
        </div>
    );
}

export default EditBook;