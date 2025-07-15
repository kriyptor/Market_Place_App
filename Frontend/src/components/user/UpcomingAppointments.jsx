import React from "react";
import UpcomingAppointCard from "./UpcomingAppointCard";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';
import RescheduleModal from './RescheduleModal';

function UpcomingAppointments() {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { authToken } = useAuth();
    const [showReschedule, setShowReschedule] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appointments, setAppointments] = useState([]);

    const handleRescheduleSuccess = (updatedAppointment) => {
      setAppointments(appointments.map(appt => 
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      ));
    };

  const handleReschedule = (id) => {
    const appointmentToReschedule = appointments.find(appointment => appointment.id === id);
    if (appointmentToReschedule) {
      setSelectedAppt(appointmentToReschedule);
      setShowReschedule(true);
      console.log('Rescheduling appointment:', appointmentToReschedule);
    }
    else {
      setError('Appointment not found');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/appointment/cancel/${id}`, {},
        { headers: { Authorization: authToken } }
      );
      handleCancelSuccess(id);
    } catch (error) {
      setError('Failed to cancel appointment. Please try again.');
      console.error('Error canceling appointment:', error);
    }
  };

  const handleCancelSuccess = (canceledId) => {
    setAppointments(appointments.filter(appointment => appointment.id !== canceledId));
  };

useEffect(() => {  
  const fetchUpcomingAppointments = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${BASE_URL}/appointment/user/upcoming`, {
            headers: { Authorization: authToken }
        });
        if (response.data && response.data.data) {
            setAppointments(response.data.data);
            console.log('Fetched upcoming appointments:', response.data.data);
        } else {
            setError("No appointment data received");
        }
        setLoading(false);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  fetchUpcomingAppointments();
}, []);

  return (
<>
<Container>
      <h2 className="mb-4 text-center">Upcoming Appointments</h2>
      <Row className="justify-content-center">
      <Col md={6}>
        {loading ? (
            <div className="text-center">
            <Spinner animation="border" role="status" />
            </div>
        ) : error ? (
            <Alert variant="danger" className="text-center">
            {error}
            </Alert>
        ) : appointments.length === 0 ? (
            <Alert variant="info" className="text-center">
            No upcoming appointments found.
            </Alert>
        ) : (
            appointments.map((appointment) => (
            <UpcomingAppointCard
                key={appointment.id}
                id={appointment.id}
                serviceName={appointment.serviceTitle}
                appointmentDate={appointment.date}
                appointmentTime={appointment.startTime}
                price={appointment.price}
                status={appointment.status}
                staffName={appointment.staffName}
                staffImage={appointment.staffProfilePicture}
                onReschedule={() => handleReschedule(appointment.id)}
                onCancelSuccess={handleCancelSuccess}
            />
            ))
        )}
        </Col>
      </Row>
      <RescheduleModal
      show={showReschedule}
      setShowReschedule={setShowReschedule} // Corrected prop name
      selectedAppt={selectedAppt}
      onRescheduleSuccess={handleRescheduleSuccess}
    />
    </Container>
</>
  );
}

export default UpcomingAppointments;
