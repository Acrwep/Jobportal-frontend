import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Modal, Button } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { MdDelete } from "react-icons/md";
import "./styles.css";
import { deleteSchedule, getSchedules } from "../Common/action";
import Loader from "../Common/Loader";
import { CommonToaster } from "../Common/CommonToaster";

export default function AssessmentScheduler() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedulesData();
  }, []);

  const getSchedulesData = async () => {
    setLoading(true);
    try {
      const response = await getSchedules();
      console.log("getSchedules", response);
      const data = response?.data?.data;
      const formattedEvents = data.map((item) => ({
        id: item.id,
        title: item.name + ` (${item.total_users} Users)`,
        start: `${item.schedule_date}T${item.schedule_time}`,
        allDay: false,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.log("getSchedules error", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const updateWeekButtonStyle = (view) => {
    const weekBtn = document.querySelector(".fc-timeGridWeek-button");
    if (weekBtn) {
      if (view.type === "timeGridWeek") {
        weekBtn.classList.add("active-week-btn");
      } else {
        weekBtn.classList.remove("active-week-btn");
      }
    }
  };

  const handleDateClick = (info) => {
    const title = prompt("Enter event title");
    if (title) {
      const newEvent = {
        id: new Date().getTime().toString(), // unique string id
        title,
        start: info.dateStr,
        allDay: info.allDay,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleEventDelete = async () => {
    try {
      await deleteSchedule(deleteEventId);
      CommonToaster("Deleted");
      setDeleteModal(false);
      setDeleteEventId(null);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        getSchedulesData();
      }, 300);
    }
  };

  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={24} lg={12}>
          <p className="portal_mainheadings">Assessment Scheduler</p>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "4px",
            gap: "12px",
          }}
        ></Col>
      </Row>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ marginTop: "20px", overflow: "hidden" }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            contentHeight="auto"
            editable={true}
            selectable={true}
            events={events}
            // dateClick={handleDateClick}
            eventClick={(clickInfo) => {
              setDeleteEventId(clickInfo.event.id);
              setDeleteModal(true);
            }}
            allDaySlot={false}
            customButtons={{
              myPrev: {
                text: "Prev",
                click: () => {
                  calendarRef.current.getApi().prev();
                  document.activeElement.blur(); // blur to prevent scroll
                },
              },
              myNext: {
                text: "Next",
                click: () => {
                  calendarRef.current.getApi().next();
                  document.activeElement.blur(); // blur to prevent scroll
                },
              },
            }}
            headerToolbar={{
              left: "myPrev,myNext",
              center: "title",
              right: "timeGridWeek,dayGridMonth",
            }}
            datesSet={(arg) => updateWeekButtonStyle(arg.view)}
          />
        </div>
      )}
      {/* delete modal */}
      <Modal
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
          setDeleteEventId(null);
        }}
        footer={false}
        width={420}
      >
        <div className="questionupload_deletemodalContainer">
          <div className="questionupload_deletemodal_iconContainer">
            <MdDelete size={20} color="#db2728" />
          </div>

          <p className="question_deletemodal_confirmdeletetext">
            Confirm Delete
          </p>

          <p className="question_deletemodal_text">
            Are you sure want to delete the event?
          </p>

          <div className="question_deletemodal_footerContainer">
            <Button
              className="question_deletemodal_cancelbutton"
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="question_deletemodal_deletebutton"
              onClick={handleEventDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
