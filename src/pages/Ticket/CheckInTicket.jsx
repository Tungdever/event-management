import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import Loader from "../../components/Loading";
import { toast } from 'react-toastify';
export default function ViewTicket() {
    const [loading, setLoading] = useState(true);
    const { ticketCode } = useParams();
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState(null);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 250);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:8080/api/ticket/check-in/${ticketCode}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response.data)
                if (response.data.statusCode === 1 || response.data.statusCode === "1") {
                    setToastMessage(response.data.msg);
                    setToastType("success");
                    navigate(`/dashboard/ticket/${response.data.data}`)
                }
                else {
                    setToastMessage(response.data.msg);
                    setToastType("warn");
                    navigate("/")
                }
                
            } catch (err) {
                console.error(err);
            } finally {

            }
        };
        fetch();
    }, [ticketCode]);
    useEffect(() => {
        if (toastMessage && toastType) {
            if (toastType === "info") {
                toast.info(toastMessage);
            }
            else if (toastType === "success") {
                toast.success(toastMessage);
            }
            else if (toastType === "error") {
                toast.error(toastMessage);
            }
            else if (toastType === "warn") {
                toast.warn(toastMessage);
            }
            setToastType(null)
            setToastMessage(null);
        }
    }, [toastMessage]);
    return loading ? (
        <div className="flex justify-center items-center h-screen">
            <Loader />
        </div>
    ) : (
        <>
        </>
    );
}
