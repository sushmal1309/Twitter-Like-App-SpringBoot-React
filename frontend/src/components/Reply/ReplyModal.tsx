import React, { useEffect, useState } from "react";

import { Close as CloseIcon } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";

import TagFacesIcon from "@mui/icons-material/TagFaces";

import EmojiPicker from "emoji-picker-react";

import SlideshowIcon from "@mui/icons-material/Slideshow";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tweetMSURL, userMSURL } from "../portsFolder/portNoForMs";

type ReplyState = {
  handleClose: any;
  tweetItem: any;
  open: any;
  profileData: any;
};
const ReplyModal: React.FC<ReplyState> = ({
  handleClose,
  tweetItem,
  open,
  profileData,
}) => {
  const token = localStorage.getItem("token");
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const tweetURL = tweetMSURL;
  const UserURL = userMSURL;
  const [valid, setValid] = useState(true);
  const [error, setError] = useState("");
  const [tweetData, setTweetData] = useState({
    tweetText: "",
    image: "",
    video: "",
  });
  const [myProfileData, setMyProfileData] = useState({
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
  const userId = localStorage.getItem("user");
  const [openEmoji, setOpenEmoji] = useState(false);
  const timeUnits: {
    unit: Intl.RelativeTimeFormatUnit | string;
    seconds: number;
  }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];
  function fetchData() {
    axios
      .get(UserURL + "/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setMyProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function getRelativeTime(secondsAgo: any) {
    for (const { unit, seconds } of timeUnits) {
      if (secondsAgo >= seconds || unit === "second") {
        const value = Math.floor(secondsAgo / seconds);
        return rtf.format(-value, unit as Intl.RelativeTimeFormatUnit);
      }
    }
  }
  function formatTweetTimestamp(timestamp: any) {
    const now: any = new Date();
    const diffInSeconds: number = Math.floor((now - timestamp) / 1000);

    // Show relative time for events within the past week
    if (diffInSeconds < 7 * 86400) {
      return getRelativeTime(diffInSeconds);
    } else {
      // Show absolute date for events older than a week
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
      }).format(timestamp);
    }
  }
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  function getBase64Size(base64String: string): number {
    // Remove data URL prefix (if exists)
    const base64Data = base64String.split(",")[1] || base64String;

    // Calculate padding characters (`=`) at the end
    const padding = (base64Data.match(/=+$/) || [""])[0].length;

    // Calculate size in bytes
    return (base64Data.length * 3) / 4 - padding;
  }

  async function handleImageChange(event: any, field: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Convert and store Base64 image
      const base64 = await convertToBase64(file);
      const imageSize = getBase64Size(base64);

      if (imageSize > 26624) {
        setError("File size exceeds 26KB limit.");
        setTweetData((prev) => ({ ...prev, [field]: base64 }));
        setValid(false);
      } else {
        setError("");
        setTweetData((prev) => ({ ...prev, [field]: base64 }));
        setValid(true);
      }
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
  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(tweetData);
    const media = [];
    if (tweetData.image !== "") {
      media.push({
        mediaUrl: tweetData.image,
        mediaType: "IMAGE",
        createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      });
    }
    if (tweetData.video !== "") {
      media.push({
        mediaUrl: tweetData.video,
        mediaType: "VIDEO",
        createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      });
    }
    const tweetState = {
      userId: userId,
      tweetContent: tweetData.tweetText,
      type: "REPLY",
      likes: 0,
      createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      updatedAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      media: media,
    };
    console.log(tweetState);
    axios
      .post(tweetURL + "/create?tweetId=" + tweetItem.tweetId, tweetState)
      .then((response) => {
        console.log(response);
        // fetchTweetData();
        setTweetData((state) => ({
          ...state,
          tweetText: "",
          image: "",
          video: "",
        }));
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleOpenEmoji() {
    setOpenEmoji((open) => !open);
  }

  function handleEmojiClick(value: any) {
    const { emoji } = value;

    handleEmojiChange("tweetText", emoji);
  }
  function handleEmojiChange(name: string, value: string) {
    setError("");
    setTweetData((prev) => {
      const data = prev.tweetText + value;
      if (data.length > 127) {
        console.log(value);
        setValid(false);
      } else {
        setValid(true);
      }

      return { ...prev, [name]: prev.tweetText + value };
    });
  }
  function handleCloseMedia(name: string) {
    setError("");
    setValid(true);
    setTweetData((prev) => ({ ...prev, [name]: "" }));
  }
  function handleChange(e: any) {
    const { name, value } = e.target;
    setError("");

    if (name === "tweetText") {
      if (value.length > 280) {
        setValid(false);
      } else {
        setValid(true);
      }
    }
    setTweetData((data) => ({ ...data, [name]: value }));
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          sx: { backgroundColor: "rgba(255, 255, 255, 0.2)" }, // Light background
        }}
      >
        <DialogTitle>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          Reply Tweet
        </DialogTitle>
        <DialogContent>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-2">
                <Avatar
                  alt="Avatar"
                  src={profileData.profilePicture}
                  className="cursor-pointer"
                  onClick={() => handleProfileClick(profileData.userId)}
                />
              </div>
              <div className="col-10">
                <div className="d-flex justify-content-between align-items-center ">
                  <div
                    className="d-flex cursor-pointer align-items-center gap-4"
                    onClick={() => handleProfileClick(profileData.userId)}
                  >
                    <span className="text-dark" style={{ fontWeight: "700" }}>
                      {profileData.firstName} {profileData.lastName}
                    </span>
                    <span className=" text-gray-600">
                      @{profileData.firstName}
                      {"_"}
                      {profileData.lastName} ·{" "}
                    </span>
                    <span>
                      {formatTweetTimestamp(new Date(tweetItem.createdAt))}
                    </span>
                  </div>
                </div>
                <div className="mt-2 ">
                  <div
                    className="cursor-pointer"
                    // onClick={handleNavigateToTwitDetial}
                  >
                    <p className="mb-2 p-0 ">{tweetItem.tweetContent}</p>
                    {tweetItem.media.length > 0 &&
                      tweetItem.media.map((media: any) => {
                        if (media.mediaType === "IMAGE") {
                          return (
                            <img
                              className="w-[28rem] border border-gray-400 p-4 rounded-md"
                              src={media.mediaUrl}
                              alt=""
                            />
                          );
                        } else if (media.mediaType === "VIDEO") {
                          return (
                            <video
                              controls
                              className="w-[28rem] border border-gray-400 p-4 rounded-md"
                              src={media.mediaUrl}
                            />
                          );
                        }
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3 mt-4">
            <Avatar
              alt="Avatar"
              src={myProfileData.profilePicture}
              onClick={() => handleProfileClick(String(myProfileData.userId))}
            />
            <div className="w-100">
              <form onSubmit={handleSubmit}>
                <div>
                  <textarea
                    className="form-control border-0 bg-transparent fs-5 focus-ring-0 shadow-none"
                    placeholder="What is Happening"
                    maxLength={280}
                    onChange={handleChange}
                    name="tweetText"
                    value={tweetData.tweetText}
                  />
                  <span>
                    {280 - tweetData.tweetText.length}/{280} characters
                    remaining
                  </span>
                  {error && <p className="text-danger">{error}</p>}
                </div>
                {tweetData.image && (
                  <div className="position-relative">
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={() => handleCloseMedia("image")}
                      aria-label="close"
                      className="position-absolute top-0 end-0 me-5 "
                    >
                      <CloseIcon />
                    </IconButton>
                    <img
                      // className="w-[28rem] border border-gray-400 p-4 rounded-md"
                      src={tweetData.image}
                      alt="tweetImage"
                      width={"60%"}
                    />
                  </div>
                )}
                {tweetData.video && (
                  <div className="position-relative">
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={() => handleCloseMedia("video")}
                      aria-label="close"
                      className="position-absolute top-0 end-0 me-5 "
                    >
                      <CloseIcon />
                    </IconButton>
                    <video
                      className="w-[28rem] border border-gray-400 p-4 rounded-md"
                      src={tweetData.video}
                      controls
                      width={"80%"}
                    />
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex gap-3 align-items-center">
                    <label className="d-flex align-items-center gap-2 rounded-md cursor-pointer">
                      <ImageIcon className="text-primary" />
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        style={{ display: "none" }}
                        id="image-upload"
                        onChange={(e) => handleImageChange(e, "image")}
                      />
                    </label>
                    <label className="flex align-items-center gap-2  rounded-md cursor-pointer">
                      <SlideshowIcon className="text-primary" />
                      <input
                        type="file"
                        accept="video/mp4, video/webm"
                        name="video"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageChange(e, "video")}
                      />
                    </label>

                    <div className="position-relative">
                      <TagFacesIcon
                        onClick={handleOpenEmoji}
                        className="text-primary cursor-pointer"
                      />
                      {openEmoji && (
                        <div className="position-absolute custom-top-10 z-50 ">
                          <EmojiPicker
                            lazyLoadEmojis={true}
                            onEmojiClick={handleEmojiClick}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="align-items-start">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "#1d9bf0",
                        borderRadius: "20px",
                        paddingY: "8px",
                        paddingX: "20px",
                        color: "white",
                      }}
                      disabled={!valid}
                    >
                      Reply Tweet
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReplyModal;
