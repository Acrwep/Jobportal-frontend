import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./styles.css";
import { Row, Col, Modal, Button } from "antd";
import { TbEdit } from "react-icons/tb";
import {
  createFolder,
  deleteFolder,
  getFolders,
  updateFolder,
} from "../Common/action";
import { useDispatch } from "react-redux";
import moment from "moment";
import CommonInputField from "../Common/CommonInputField";
import { addressValidator } from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import { RiDeleteBinLine } from "react-icons/ri";

export default function FolderManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    getFoldersData();
  }, []);

  const getFoldersData = async () => {
    const userId = localStorage.getItem("loginUserId");
    try {
      const response = await getFolders(userId);
      console.log(response);
      setFolders(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickedFolder = async (item) => {
    console.log("clicked item", item);
    const payload = {
      candidateIds: JSON.parse(item.candidateIds),
    };
    setTimeout(() => {
      navigate("/folderprofiles", {
        state: {
          folderName: item.name,
          folderId: item.id,
          candidateIds: JSON.parse(item.candidateIds),
        },
      });
    }, 300);
    // dispatch(storeFolderFilters([payload]));
    // try {
    //   const response = await getMultipleCandidatesById(payload);
    //   console.log("candidates response", response?.data?.data);
    //   dispatch(storeFolderProfiles(response?.data?.data));
    // } catch (error) {
    //   console.log(error);
    //   dispatch(storeFolderProfiles([]));
    // } finally {

    // }
  };

  const handleCreateAndUpdate = async () => {
    const nameValidate = addressValidator(folderName);

    setFolderNameError(nameValidate);

    if (nameValidate) return;

    const userId = localStorage.getItem("loginUserId");

    const payload = {
      name: folderName,
      userId: userId,
      ...(folderId && { folderId: folderId }),
      ...(folderId && { candidateIds: candidates }),
    };

    if (folderId) {
      try {
        await updateFolder(payload);
        CommonToaster("Updated");
        setIsModalOpen(false);
        getFoldersData();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await createFolder(payload);
        CommonToaster("Created");
        setIsModalOpen(false);
        getFoldersData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFolder(deleteFolderId);
      CommonToaster("Folder deleted");
      setIsDeleteModalOpen(false);
      setDeleteFolderId(null);
      getFoldersData();
    } catch (error) {
      console.log(error);
      CommonToaster("Unable to delete. Try again later");
    }
  };

  const formReset = () => {
    setFolderId(null);
    setFolderName("");
    setFolderNameError("");
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="folder_mainContainer">
      <Header />

      <div className="folders_innercontainer">
        <Row className="folders_headingContainer">
          <Col span={12}>
            <p className="folders_heading">Folder Management</p>
          </Col>
          <Col
            span={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              className="folders_createfolder_button"
              onClick={() => setIsModalOpen(true)}
            >
              Create Folder
            </button>
          </Col>
        </Row>
        {folders.length >= 1 ? (
          <>
            {folders.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="folders_listContainer">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <p
                          className="folders_listname_text"
                          onClick={() => handleClickedFolder(item)}
                        >
                          {item.name}
                        </p>
                        <p className="folders_listcreatedat_text">
                          Created At:{" "}
                          {moment(item.createdAt).format("YYYY-MM-DD hh:mm A")}
                        </p>
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
                        }}
                      >
                        <TbEdit
                          size={24}
                          onClick={() => {
                            const candidateIds = JSON.parse(item.candidateIds);
                            setCandidates(candidateIds);
                            setIsModalOpen(true);
                            setFolderId(item.id);
                            setFolderName(item.name);
                          }}
                          style={{ cursor: "pointer", marginRight: "16px" }}
                        />
                        <RiDeleteBinLine
                          size={22}
                          color="#d32215"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setDeleteFolderId(item.id);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <div className="folders_nodatadiv">
            <p>No data found</p>
          </div>
        )}
      </div>

      <Modal
        title={`${folderId ? "Update Folder" : "Create Folder"}`}
        open={isModalOpen}
        onOk={handleCreateAndUpdate}
        onCancel={formReset}
        footer={[
          <button
            className="admin_modalsubmitbutton"
            onClick={handleCreateAndUpdate}
          >
            Submit
          </button>,
        ]}
      >
        <div>
          <CommonInputField
            label="Name"
            mandatory={true}
            onChange={(e) => {
              setFolderName(e.target.value);
              setFolderNameError(addressValidator(e.target.value));
            }}
            value={folderName}
            error={folderNameError}
          />
        </div>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
        }}
        footer={[
          <Button
            className="folders_modalcancelbutton"
            onClick={() => setIsDeleteModalOpen(false)}
            style={{ marginRight: "16px" }}
          >
            No
          </Button>,
          <Button className="folders_modalsubmitbutton" onClick={handleDelete}>
            Yes
          </Button>,
        ]}
      >
        <div style={{ marginTop: "6px" }}>
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            Are you sure you want to delete the folder?
          </p>
        </div>
      </Modal>
    </div>
  );
}
