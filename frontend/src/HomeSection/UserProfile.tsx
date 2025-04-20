import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EditProfile from "./EditProfile";
import { Avatar, Box, Button, Tab } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { BusinessCenterSharp } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import TweetCard from "../components/Twit/TweetCard";

import FollowersSection from "../components/Followers/FollowersSection";
import FollowingSection from "../components/Following/FollowingSection";
import UnFollowModel from "../components/Following/UnFollowModel";
import {
  followerMSURL,
  tweetMSURL,
  userMSURL,
} from "../components/portsFolder/portNoForMs";
import { useDispatch } from "react-redux";
import ReTweetCard from "../components/Reply/ReTweetCard";
import TweetPageCard from "../components/Twit/TweetPageCard";

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userUrl = userMSURL;
  const token = localStorage.getItem("token");
  const userId: string | null = localStorage.getItem("user");
  const tweetURL = tweetMSURL;
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = React.useState("1");
  const [tweetInfoForUser, setTweetInfoForUser] = useState([]);
  const followersURL = followerMSURL;
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersProfileData, setFollowersProfileData] = useState([]);
  const [followingProfielData, setFollowingProfileData] = useState([]);
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
  const [retweetInfoForUser, setReTweetInfoForUser] = useState([]);
  const [unFollowOpenModel, setUnFollowOpenModel] = useState(false);
  const handleUnFollowModel = () => setUnFollowOpenModel((open) => !open);
  function fetchData() {
    axios
      .get(userUrl + "/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchTweetData() {
    axios
      .get(tweetURL + "/" + id)
      .then((response) => {
        setTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleDelete() {
    fetchTweetData();
  }
  function handleUpdate() {
    fetchTweetData();
  }
  function fetchFollowersIds() {
    axios
      .get(followersURL + "/followers/" + id)
      .then((response) => {
        setFollowers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchReTweetData() {
    axios
      .get(tweetURL + "/retweet/" + id)
      .then((response) => {
        console.log(response.data);
        setReTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchFollowingIds() {
    axios
      .get(followersURL + "/followings/" + id)
      .then((response) => {
        setFollowing(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchFollowersUserData() {
    axios
      .post(userUrl + "/profiles", followers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setTabValue("3");
        setFollowersProfileData(response.data);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  function fetchFollowersUserDataByButton() {
    axios
      .post(userUrl + "/profiles", followers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);

        setFollowersProfileData(response.data);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }
  function fetchFollowingUserData() {
    axios
      .post(userUrl + "/profiles", following, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setTabValue("2");
        setFollowingProfileData(response.data);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }
  useEffect(() => {
    fetchData();
    fetchTweetData();
    fetchFollowersIds();
    fetchFollowingIds();
    fetchReTweetData();
    setTabValue("1");
  }, [id]);
  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
    console.log(newValue);
    if (newValue === "2") {
      fetchFollowingUserData();
    } else if (newValue === "3") {
      fetchFollowersUserData();
    }
  };

  const handleSave = () => {
    fetchData();
    setOpen(false);
  };
  function handleUnFollow() {
    handleUnFollowModel();
    axios
      .delete(
        followersURL +
          "/unfollow?userId=" +
          Number(id) +
          "&" +
          "followerId=" +
          Number(userId)
      )
      .then((response) => {
        console.log(response.data);
        fetchFollowersIds();
        fetchFollowersUserDataByButton();
        dispatch({
          type: "UNFOLLOW_TWEET_DATA",
          payload: { profileData: profileData, tweetData: tweetInfoForUser },
        });
        console.log("Api SuccessFull");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleFollowClick(e: any) {
    const content = e.target.textContent;
    if (content === "FOLLOW") {
      axios
        .post(
          followersURL + "/add",
          {
            userId: id,
            followerId: userId,
            followedAt: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          fetchFollowersIds();
          fetchFollowersUserDataByButton();

          dispatch({
            type: "FOLLOWING_TWEET_DATA",
            payload: { userData: profileData, tweetData: tweetInfoForUser },
          });
          console.log("Api SuccessFull");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (content === "UNFOLLOW") {
      handleUnFollowModel();
    }
  }
  const navigate = useNavigate();

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
    <div>
      <section className="py-2" style={{ display: "flex", gap: "10px" }}>
        <KeyboardBackspaceIcon className="cursor-pointer" />
        <h5 className="">
          {profileData.firstName}
          {profileData.lastName}
        </h5>
      </section>
      <section>
        <img
          src={profileData.coverPhoto || "https://via.placeholder.com/600x200"}
          alt="coverImage"
          width={500}
          height={250}
        />
      </section>

      <section className="pl-6">
        <div className="d-flex justify-content-between align-items-start mt-0 h-[5rem]">
          <Avatar
            alt="Avatar"
            src={profileData.profilePicture || ""}
            className="transform -translate-y-24 "
            sx={{
              width: "8rem",
              height: "8rem",
              border: "4px solid white",
              transform: "translateY(-24%)",
            }}
            onClick={() => handleProfileClick(String(profileData.userId))}
          />
          <Button
            variant="contained"
            className="mt-2"
            onClick={handleFollowClick}
          >
            {followers.filter((f) => f == userId).length === 1
              ? "UNFOLLOW"
              : "FOLLOW"}
          </Button>
        </div>
        <div onClick={() => handleProfileClick(String(profileData.userId))}>
          <p
            style={{
              fontSize: "20px",
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
            className="mb-0"
          >
            {profileData.firstName + " "} {profileData.lastName}
          </p>
          <p
            style={{
              fontSize: "16px",
              fontFamily: "sans-serif",

              color: "grey",
            }}
            className="mt-0"
          >
            {"@" + profileData.firstName}{" "}
            {profileData.lastName && "_" + profileData.lastName}
          </p>
        </div>
        <div className="mt-2  gap-3">
          {profileData.bio && (
            <p className="text-secondary " style={{ fontWeight: "400" }}>
              {profileData.bio}
            </p>
          )}

          <div className="py-1 d-flex gap-5">
            <div className="d-flex align-items-center text-secondary gap-2">
              <BusinessCenterSharp />
              <p className="mb-0">Education</p>
            </div>
            <div className="d-flex align-items-center text-secondary gap-2">
              {profileData.isLocationEnabled == "TRUE" && (
                <>
                  <LocationOnIcon />
                  <p className="mb-0">{profileData.location}</p>
                </>
              )}
            </div>
            <div className="d-flex align-items-center text-secondary gap-2">
              <CalendarMonthIcon />
              <p className="mb-0">{profileData.joinedDate}</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-5 mt-2">
            <div
              className="d-flex align-items-center gap-2"
              style={{ fontWeight: "bold" }}
            >
              <span>{following.length}</span>
              <span className="text-secondary" onClick={fetchFollowingUserData}>
                Following
              </span>
            </div>
            <div
              className="d-flex align-items-center gap-1 font-semibold"
              style={{ fontWeight: "bold" }}
            >
              <span>{followers.length}</span>
              <span className="text-secondary" onClick={fetchFollowersUserData}>
                Followers
              </span>
            </div>
          </div>
        </div>
        <section>
          <Box sx={{ width: "100%", typography: "body1", marginTop: "20px" }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Tweets" value="1" />
                  <Tab label="Following" value="2" />
                  <Tab label="Followers" value="3" />
                  <Tab label="ReTweets" value="4" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {tweetInfoForUser.map((item) => (
                  <TweetPageCard profileData={profileData} tweetItem={item} />
                ))}
              </TabPanel>
              <TabPanel value="2">
                {" "}
                {followingProfielData.map((following) => (
                  <FollowingSection profileData={following} />
                ))}
              </TabPanel>
              <TabPanel value="3">
                {" "}
                {followersProfileData.map((followers) => (
                  <FollowersSection profileData={followers} />
                ))}
              </TabPanel>
              <TabPanel value="4">
                {retweetInfoForUser.map((reTweetItem) => (
                  <ReTweetCard reTweetData={reTweetItem} />
                ))}
              </TabPanel>
            </TabContext>
          </Box>
        </section>
      </section>
      {open && (
        <EditProfile
          open={open}
          handleClose={() => setOpen(false)}
          user={profileData}
          handleSave={handleSave}
        />
      )}
      {unFollowOpenModel && (
        <UnFollowModel
          open={unFollowOpenModel}
          handleClose={handleUnFollowModel}
          profileData={profileData}
          handleUnFollow={handleUnFollow}
        />
      )}
    </div>
  );
};
export default UserProfile;
