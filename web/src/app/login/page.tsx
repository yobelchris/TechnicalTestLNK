"use client";

import React from 'react';
import Alert from '@mui/material/Alert';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import HTTPClient from "@/http/HTTPClient";
import {LoginResponse} from "@/http/response/Response";
import {LoginRequest} from "@/http/request/Request";
import InternalServerError from "@/libs/error/InternalServerError";
import { useRouter } from 'next/navigation';

export default function Login () {
    const router = useRouter();

    React.useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            router.push('/');
        }
    }, [router]);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setError(null);
        event.preventDefault();

        try{
            const result = await HTTPClient.GetClient().sendRequest<LoginResponse>(new LoginRequest(username, password), "login", "POST");

            if(result.validationErrors && result.validationErrors.has("username")) {
                setUsernameError(true);
                setUsernameErrorMessage(result.validationErrors.get("username") as string);
            }

            if(result.validationErrors && result.validationErrors.has("password")) {
                setPasswordError(true);
                setPasswordErrorMessage(result.validationErrors.get("password") as string);
            }

            if(result.status !== 200) {
                setError(result.message);
                return;
            }

            if(result.data) {
                localStorage.setItem("accessToken", result.data.token);
                localStorage.setItem("refreshToken", result.data.refreshToken);
            }else {
                throw new InternalServerError();
            }
        }catch (err: any) {
            console.error("LOGIN ERROR : ", err);
            setError("LOGIN ERROR");
            return;
        }

        router.push("/");
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 8,
                }}
            >
                <Typography component="h1" variant="h5" color="primary">
                    Sign In
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        error={usernameError}
                        helperText={usernameErrorMessage}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};