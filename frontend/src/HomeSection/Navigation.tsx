import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { navigationMenu } from "./NavigationMenu";
import { Avatar, Button } from "@mui/material";

import XIcon from "@mui/icons-material/X";
import axios from "axios";
import { userMSURL } from "../components/portsFolder/portNoForMs";
const Navigation = () => {
  const token = localStorage.getItem("token");
  console.log("NavigationToken", token);
  const userId = localStorage.getItem("user");
  const userUrl = userMSURL;
  const [profileData, setProfileData] = useState({
    bio: "",
    coverPhoto: "",
    dateOfBirth: "",
    emailId: "",
    firstName: "",
    joinedDate: "",
    lastName: "",
    location: "",
    profilePicture: "",
    userId: 0,
    website: "",
  });
  function fetchData() {
    axios
      .get(userUrl + "/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();
  const handleTweet = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };
  function handleProfileClick(id: string) {
    console.log(id);
    console.log(userId);
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  return (
    <div
      className="sticky-top d-flex flex-column align-items-between justify-content-between"
      style={{ height: "100vh" }}
    >
      <div className="px-2 mb-3 ">
        <div className="py-4">
          <XIcon sx={{ fontSize: "50px" }} />
        </div>
        <div className="flex column mb-2">
          {navigationMenu.map((item) => (
            <div
              onClick={() =>
                item.title === "Profile"
                  ? navigate(`/home/profile`)
                  : navigate(`/${item.title.toLowerCase()}`)
              }
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
                marginBottom: "30px",
              }}
              key={item.title}
            >
              {item.icon}
              <p style={{ margin: "0px" }}>{item.title}</p>
            </div>
          ))}
        </div>
        <div className="py-10">
          <Button
            sx={{
              width: "100%",
              borderRadius: "29px",
              py: "10px",
              bgcolor: "#1d9bf0",
            }}
            variant="contained"
            size="small"
            onClick={handleTweet}
          >
            Tweet
          </Button>
        </div>
      </div>

      <div className="flex align-items-center  d-flex justify-content-between">
        <div
          className="d-flex flex-row gap-3"
          onClick={() => handleProfileClick(String(profileData.userId))}
        >
          <Avatar alt="Remy Sharp" src={profileData.profilePicture || ""} />

          <div>
            <p
              style={{ margin: "0px" }}
            >{`${profileData.firstName} ${profileData.lastName}`}</p>
            <p>
              @{profileData.firstName}
              {"_"}
              {profileData.lastName && profileData.lastName.length > 5
                ? profileData.lastName.substring(0, 1)
                : profileData.lastName}
            </p>
          </div>
        </div>
        <button
          className="btn btn-primary me-2"
          onClick={handleLogout}
          style={{ fontSize: "14px" }}
        >
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Navigation;
