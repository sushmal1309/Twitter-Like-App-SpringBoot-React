import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  followerMSURL,
  searchMSURL,
  userMSURL,
} from "../components/portsFolder/portNoForMs";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { error } from "console";

const RightPart: React.FC = () => {
  const searchUrl = searchMSURL;
  const userUrl = userMSURL;
  const followersURL = followerMSURL;
  const userId = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [finalResult, setFinalResult] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDeleteMenu = Boolean(anchorEl);

  const handleOpenDeleteMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDeleteMenu = () => {
    setAnchorEl(null);
  };
  function handleChange(e: any) {
    setSearch(e.target.value);
    console.log(e.target.value);
    setFinalResult([]);
    if (e.target.value === "") {
      setSearchResult([]);
      navigate("/home");

      dispatch({
        type: "TWEET_DATA",
        payload: { tweets: [], userIdsProfileData: [] },
      });

      return;
    }
    axios
      .get(searchUrl + "/user?query=" + e.target.value, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setSearchResult(response.data);
        const data = response.data;
        let userIds = [];
        data.forEach((ele: any) => userIds.push(ele.userIds));

        axios
          .get(followersURL + "/followings/" + userId)
          .then((response) => {
            console.log(response);
            setFollowingIds(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    fetchTweetData();
  }

  function fetchTweetData() {
    axios
      .get(searchUrl + "/tweets?query=" + search, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.length > 0) {
          let userIds: number[] = [];
          data.forEach((ele: any) => userIds.push(ele.userId));
          console.log(userIds);
          axios
            .post(userUrl + "/profiles", userIds, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              navigate("/home/tweetPage");
              dispatch({
                type: "TWEET_DATA",
                payload: { tweets: data, userIdsProfileData: response.data },
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleKeyButton(e: any) {
    console.log(e);
    if (e.nativeEvent.key === "Enter") {
      setFinalResult(searchResult);
      setSearchResult([]);
      fetchTweetData();
    }
  }

  function handleProfileClick(id: string) {
    console.log(id);
    console.log(userId);
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
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
    isLocationEnabled: "",
  });
  const [isLocationEnable, setLocationEnabled] = useState<boolean>(false);
  function handleLocationChange(e: any) {
    console.log(userId);
    console.log(e.target.checked);
    setLocationEnabled((enable: Boolean) => !enable);
    axios
      .get(
        userUrl + "/privacy/" + userId + "?enabled=" + String(e.target.checked),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchUserData() {
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
        console.log(Boolean(String(res.data.isLocationEnabled).toLowerCase()));
        setLocationEnabled(res.data.isLocationEnabled == "TRUE" ? true : false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchUserData();
    if (search === "") {
      navigate("/home");
    }
  }, []);

  return (
    <div className="py-5 sticky-top  overflow-hidden">
      <div className="overflow-auto">
        <div className="position-relative d-flex align-items-center ms-4">
          <div className="form-group d-flex justify-content-between gap-4 align-items-center">
            <input
              value={search}
              onChange={handleChange}
              type="text"
              placeholder="Search"
              className="form-control"
              style={{
                paddingTop: "13px",
                paddingBottom: "13px",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
              onKeyUp={handleKeyButton}
            />
            <div>
              <Button onClick={handleOpenDeleteMenu}>
                <Brightness4Icon
                  id="basic-button"
                  aria-controls={openDeleteMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDeleteMenu ? "true" : undefined}
                  className="ml-3 cursor-pointer"
                />
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openDeleteMenu}
                onClose={handleCloseDeleteMenu}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={isLocationEnable}
                    onChange={handleLocationChange}
                  />
                  <MenuItem>Location</MenuItem>
                </div>
              </Menu>
            </div>
          </div>
          <span className="position-absolute top-0 start-0 left-8 ps-1 pt-3">
            <SearchIcon className="text-secondary" />
          </span>
        </div>
        {searchResult.length > 0
          ? searchResult.map((data: any) => (
              <div
                onClick={() => handleProfileClick(data.userId)}
                className="d-flex align-items-center gap-2 ms-3 p-3 cursor-pointer"
              >
                <Avatar alt={data.firstName} src={data.profilePicture} />
                <div className="ms-2">
                  <p className="mb-0">
                    {data.firstName + " "}
                    {data.lastName}
                  </p>
                  <p className="text-sm text-secondary mb-0">
                    @{data.firstName + "_"}
                    {data.lastName}
                  </p>
                </div>
              </div>
            ))
          : search !== "" &&
            finalResult.length === 0 && (
              <p
                style={{ fontSize: "35px", fontWeight: "bold" }}
                className="mt-3 ps-3"
              >
                No users Found
              </p>
            )}
        {finalResult.length > 0 &&
          finalResult.map((data: any) => (
            <div
              className="d-flex gap-3 mt-3 ms-2"
              onClick={() => handleProfileClick(data.userId)}
            >
              <Avatar
                alt="Avatar"
                src={data.profilePicture}
                className="cursor-pointer"
              />
              <div className="w-100">
                <div className="d-flex gap-1 align-items-start justify-content-between ">
                  <div className="d-flex flex-column cursor-pointer justify-content-center align-items-start gap-0">
                    {" "}
                    <span className="text-dark" style={{ fontWeight: "700" }}>
                      {data.firstName} {data.lastName}
                    </span>
                    <span className=" text-secondary">
                      @{data.firstName}
                      {"_"}
                      {data.lastName}.
                    </span>
                    <p className="mb-0">{data.bio}</p>
                  </div>
                  {userId != data.userId && (
                    <button className="btn btn-primary">
                      {followingIds.filter((ele) => data.userId == ele)
                        .length == 1
                        ? "UNFOLLOW"
                        : "FOLLOW"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default RightPart;
