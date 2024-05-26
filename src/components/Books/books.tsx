import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api-client';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const search = searchParams.get("search");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchVal?.length > 0) {
                navigate(
                    `.?search=${searchVal}`
                );
            } else {
                navigate("/");
            }
        }, 0.5);
        return () => {
            clearTimeout(timer);
        };
    }, [searchVal]);
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
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchVal(e.target.value);
    };
    const navigate = useNavigate();
    const { data, error, isLoading } = useQuery<BookInArray[], Error>({
        queryKey: ['allBooks', search], queryFn: () => {
            if (search) {
                return apiClient('GET', `/books/${search}`);
            } else {
                return apiClient('GET', '/books')
            }
        }
    });
    return (
        <div>
            <TextField
                size='small'
                onChange={changeHandler}
                placeholder="Search..."
            />
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {data && <div>
                <h2>Books</h2>
                {data ? data?.length > 0 && data.map((book) => <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} key={book?.book?.id}>
                    <h3>Book: {book?.book?.id}</h3>
                    {book?.book?.title && <h3>{book?.book?.title}</h3>}
                    <Button onClick={() => navigate(`/books/${book?.book?.id}`)} variant="contained">Update</Button>
                    <React.Fragment>
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
                    </React.Fragment></div>) : "no data"}
            </div>}

        </div>
    )
}

export default Books