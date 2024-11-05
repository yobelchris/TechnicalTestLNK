"use client";

import React from 'react';
import {Calendar, momentLocalizer, View} from 'react-big-calendar';
import {startOfMonth, endOfMonth, startOfDay, endOfDay, format} from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {GetEmailResponse, RefreshTokenResponse} from "@/http/response/Response";
import HTTPClient from "@/http/HTTPClient";
import moment from "moment";
import {GetEmailRequest, SendEmailRequest} from "@/http/request/Request";
import Alert from "@mui/material/Alert";
import {useRouter} from 'next/navigation';
import InternalServerError from "@/libs/error/InternalServerError";
import {AppBar, Button, CircularProgress, Modal, TextField, Toolbar, Typography} from "@mui/material";

const localizer = momentLocalizer(moment);

interface Event {
    title: string;
    start: Date;
    end: Date;
}

const EmailModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onSubmit: (email: string, description: string) => void
}> = ({open, onClose, onSubmit}) => {
    const [email, setEmail] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [date, setDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email, description);
        onClose();
        setEmail(''); // Reset email field
        setDescription(''); // Reset description field
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{padding: '20px', background: 'white', borderRadius: '8px', outline: 'none'}}>
                <h2>Create Email</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date"
                        value={date}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                </form>
            </div>
        </Modal>
    );
};

export default function Home() {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [events, setEvents] = React.useState<Event[]>([]);
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [currentView, setCurrentView] = React.useState<View>("month");
    const [modalOpen, setModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            router.push('/login');
        }

        fetchEvents(startOfMonth(currentDate), endOfMonth(currentDate));
    }, [router]);

    const fetchEvents = async (startDate: Date, endDate: Date) => {
        setLoading(true);
        try {
            const result = await HTTPClient.GetClient().sendRequest<GetEmailResponse[]>(new GetEmailRequest(format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd")), "email", "GET", localStorage.getItem('accessToken') as string);

            try {
                if (await HTTPClient.GetClient().isNeedLoginAgain(result)) {
                    router.push("/login");
                    return;
                }
            } catch (err: any) {
                console.error("FETCH TOKEN ERROR : ", err);
                if (err instanceof InternalServerError) {
                    setError(err.message);
                } else {
                    setError("Error fetching token");
                }
            }

            if (result.status !== 200) {
                setError(result.message);
                return;
            }

            if (result.data) {
                setEvents(result.data.map(email => {
                    return {
                        title: email.email,
                        start: startOfDay(new Date(email.date)),
                        end: endOfDay(new Date(email.date))
                    }
                }));
            }
        } catch (err: any) {
            console.error("FETCH EMAIL ERROR : ", err);
            setError("Error fetching email");
            return;
        } finally {
            setLoading(false);
        }
    }

    const handleSubmitEmail = async (email: string, description: string) => {
        setLoading(true);
        try {
            const result = await HTTPClient.GetClient().sendRequest<GetEmailResponse[]>(new SendEmailRequest(email, format(currentDate, "yyyy-MM-dd"), description), "email", "POST", localStorage.getItem('accessToken') as string);

            try {
                if (await HTTPClient.GetClient().isNeedLoginAgain(result)) {
                    router.push("/login");
                    return;
                }
            } catch (err: any) {
                console.error("FETCH TOKEN ERROR : ", err);
                if (err instanceof InternalServerError) {
                    setError(err.message);
                } else {
                    setError("Error fetching token");
                }
            }

            if (result.status !== 200) {
                setError(result.message);
                return;
            }

            await fetchEvents(startOfMonth(currentDate), endOfMonth(currentDate));

            setModalOpen(false);
        } catch (err: any) {
            console.error("SEND EMAIL ERROR : ", err);
            setError("Error sending email");
            return;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try{
            const result = await HTTPClient.GetClient().sendRequest<GetEmailResponse[]>(null, "logout", "POST", localStorage.getItem('accessToken') as string);

            if(result.status !== 200 && result.status !== 401) {
                console.error("LOGOUT ERROR : ", result);
                setError(result.message);
            }

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            router.push('/login');
        }catch (err: any) {
            console.error("LOGOUT ERROR : ", err);
            setError("Error logging out");
        }finally {
            setLoading(false);
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Email Calendar
                    </Typography>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            {error && <Alert severity="error">{error}</Alert>}
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', margin: '20px'}}>
                <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
                    Create Email
                </Button>
                <EmailModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSubmitEmail}
                />
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
                        <CircularProgress/>
                    </div>
                ) : (
                    <div style={{flexGrow: 1, width: '100%', marginTop: '20px'}}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            date={currentDate}
                            onNavigate={(newDate: Date) => {
                                console.log('Navigated to:', newDate);
                                setCurrentDate(newDate);
                                fetchEvents(startOfMonth(newDate), endOfMonth(newDate));
                            }}
                            onView={(newView: View) => {
                                console.log('View changed to:', newView);
                                setCurrentView(newView);
                            }}
                            views={["month", "day"]}
                            defaultView={"month"}
                            view={currentView}
                            style={{height: "80vh"}}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}