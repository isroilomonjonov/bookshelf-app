import { Box, Grid, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../utils/api-client';
import { useMutation } from '@tanstack/react-query';
import { BookType } from '../books';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const bookScheme = z.object({
    author: z.string().min(2, { message: "Name must be at least 2 characters" }),
    title: z.string().min(2, { message: "Name must be at least 2 characters" }),
    cover: z.string().min(4, { message: "Secret must be at least 4 characters" }),
    published: z.number(),
    pages: z.number()
});
type Book = z.infer<typeof bookScheme>;

const AddEditBook = () => {
    const navigate = useNavigate();
    const params = useParams();
    const isCreate = params.id === "new" ? true : false
    const { register, handleSubmit } = useForm<z.infer<typeof bookScheme>>({
        resolver: zodResolver(bookScheme)
    })
    const mutation = useMutation<BookType, Error, Book>({
        mutationFn: async (newBook: Book) => {
            if (!newBook) {
                throw new Error('Book is null or undefined');
            }
            if (isCreate) {
                const response = await apiClient('POST', '/books', {
                    isbn: `${Math.random() * 1000}`,
                    ...newBook
                })
                if (!response) {
                    throw new Error('Invalid response from server');
                }
                return response;
            } else {
                const responseUpdate = await apiClient('PATCH', `/books/${params.id}`, {
                    book: { ...newBook },
                    status: 0
                })
                return responseUpdate
            }
        },
        onSuccess: async (data: BookType | undefined) => {
            if (!data) {
                throw new Error('Data is null or undefined');
            }
            navigate('/')

        },
        onError: (error) => {
            console.error('Error occurred during signup:', error);
        }

    });

    const onSubmit = async (data: Book) => {
        mutation.mutate(data)
    }
    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <div className='flex'>
                <h1>{isCreate ? "Create" : "Edit"} Book</h1>
                <Button onClick={() => navigate('/')} variant='contained'>Go Back</Button>
            </div>
            <Grid container spacing={2} direction="column"
                justifyContent="space-between" alignItems="stretch">
                <Grid item xs={12}>
                    <TextField
                        type="text"
                        {...register("title")}
                        label="Book title"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="text"
                        {...register("author")}
                        label="Author name"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="text"
                        {...register("cover")}
                        label="Image link"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        {...register("pages", {
                            setValueAs: value => parseInt(value),
                            shouldUnregister: true
                        })}
                        label="Number of Pages"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        {...register("published", {
                            setValueAs: value => parseInt(value),
                            shouldUnregister: true
                        })}
                        label="When published"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isCreate ? "Create" : "Edit"} Book
                    </Button>
                </Grid>
            </Grid>

        </Box>
    )
}

export default AddEditBook