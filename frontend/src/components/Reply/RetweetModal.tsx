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
const RetweetModal: React.FC<ReplyState> = ({
  handleClose,
  tweetItem,
  open,
  profileData,
}) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const tweetURL = tweetMSURL;
  const userId = localStorage.getItem("user");

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

    const tweetState = {
      userId: userId,
      tweetContent: tweetItem.tweetContent,
      type: "RETWEET",
      likes: tweetItem.likes,
      createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      updatedAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      media: tweetItem.media,
    };
    axios
      .post(tweetURL + "/create?tweetId=" + tweetItem.tweetId, tweetState)
      .then((response) => {
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
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
          ReTweet
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
          <div className="d-flex justify-content-end mt-3">
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
              onClick={handleSubmit}
            >
              ReTweet Tweet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RetweetModal;
