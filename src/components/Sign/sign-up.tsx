import styles from "./sign.module.css";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from '@tanstack/react-query';
import axiosInstance from "../../utils/axios-instance";
import { useNavigate } from "react-router-dom";
const userScheme = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email(),
    secret: z.string().min(4, { message: "Secret must be at least 4 characters" }),
    key: z.string().min(4)
});

type User = z.infer<typeof userScheme>;

interface SignupResponse {
    key: string;
    secret: string;
}
const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof userScheme>>({
        resolver: zodResolver(userScheme)
    })
    const mutation = useMutation<SignupResponse, Error, User>({
        mutationFn: async (newUser: User) => {
            if (!newUser) {
                throw new Error('User is null or undefined');
            }
            const response = await axiosInstance({
                url: '/signup',
                data: newUser,
                method: 'POST'
            });
            console.log(response);
            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }
            navigate('/');
            return response.data.data;
        },
        onSuccess: async (data: SignupResponse | undefined) => {
            if (!data) {
                throw new Error('Data is null or undefined');
            }
            // Signup muvaffaqiyatli, key va secret saqlanadi
            if (!data.key || !data.secret) {
                throw new Error('Invalid key or secret in response');
            }
            localStorage.setItem('key', data.key);
            localStorage.setItem('secret', data.secret);

        },
        onError: (error) => {
            console.error('Error occurred during signup:', error);
        }

    });

    const onSubmit = (data: z.infer<typeof userScheme>) => { mutation.mutate(data) };
    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {mutation.error && <span className={styles.error}>{mutation.error.message}</span>}
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    {...register("name")}
                                />
                                {errors.name && <span className={styles.error}>{errors.name.message}</span>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    {...register("email")}
                                    type='email'
                                    autoComplete="email"
                                />
                                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    {...register("key")}
                                    label="Key"
                                    type="text"
                                    id="key"
                                    autoComplete="key"
                                />
                                {errors.key && <span className={styles.error}>{errors.key.message}</span>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    {...register("secret")}
                                    label="Secret"
                                    type="text"
                                    id="secret"
                                    autoComplete="secret"
                                />
                                {errors.secret && <span className={styles.error}>{errors.secret.message}</span>}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        {/* <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>
            </Container>
        </div>
    )
}

export default SignUp