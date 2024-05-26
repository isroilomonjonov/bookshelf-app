import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api-client';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
export type BookType = {
    id: number,
    isbn: number,
    title: string,
    cover: string,
    author: string,
    published: number,
    pages: number
}
export type BookInArray = {
    book: BookType,
    status: number
}
const Books = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        const response = await apiClient('DELETE', `/books/${id}`);
        if (!response) {
            return;
        }
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const { data, error, isLoading } = useQuery<BookInArray[], Error>({
        queryKey: ['allBooks'], queryFn: () =>
            apiClient('GET', '/books')
    });
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div><h2>Books</h2> {data ? data?.length > 0 && data.map((book) => <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} key={book?.book?.id}><h3>Book: {book?.book?.id}</h3> <Button onClick={() => navigate(`/books/${book?.book?.id}`)} variant="contained">Update</Button> <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Do you want delete this book?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you want to delete this book please click on "Delete" or you can click on "Close"
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={() => handleDelete(book.book.id)} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment></div>) : "no data"}</div>
    )
}

export default Books