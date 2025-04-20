import { Avatar } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userMSURL } from "../portsFolder/portNoForMs";
type ReplyTweetState = {
  replyTweetData: any;
};
const ReplyTweetCard: React.FC<ReplyTweetState> = ({ replyTweetData }) => {
  const token = localStorage.getItem("token");

  const [replyedProfileData, setReplyedProfileData] = useState({
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
  const UserURL = userMSURL;
  useEffect(() => {
    axios
      .get(UserURL + "/" + replyTweetData.userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setReplyedProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
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
  const userId = localStorage.getItem("user");
  function handleProfileClick(id: string) {
    console.log(id);
    console.log(userId);
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  const dispatch = useDispatch();
  function handleTweetPageClick() {
    dispatch({
      type: "REPLY_DATA",
      payload: { tweetData: replyTweetData, userData: replyedProfileData },
    });
    navigate(
      "/home/replyTweetPage/" +
        replyTweetData.tweetId +
        "/" +
        replyTweetData.userId
    );
  }
  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div
            className="col-2"
            onClick={() =>
              handleProfileClick(String(replyedProfileData.userId))
            }
          >
            <Avatar
              alt="Avatar"
              src={replyedProfileData.profilePicture}
              className="cursor-pointer"
            />
          </div>
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center ">
              <div
                className="d-flex cursor-pointer align-items-center gap-4"
                onClick={() =>
                  handleProfileClick(String(replyedProfileData.userId))
                }
              >
                <span className="text-dark" style={{ fontWeight: "700" }}>
                  {replyedProfileData.firstName} {replyedProfileData.lastName}
                </span>
                <span className=" text-gray-600">
                  @{replyedProfileData.firstName}
                  {"_"}
                  {replyedProfileData.lastName} ·{" "}
                </span>
                <span>
                  {formatTweetTimestamp(new Date(replyTweetData.createdAt))}
                </span>
              </div>
            </div>
            <div className="mt-2 ">
              <div className="cursor-pointer" onClick={handleTweetPageClick}>
                <p className="mb-2 p-0 ">{replyTweetData.tweetContent}</p>
                {replyTweetData.media.length > 0 &&
                  replyTweetData.media.map((media: any) => {
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
                        <img
                          className="w-[28rem] border border-gray-400 p-4 rounded-md"
                          src={media.mediaUrl}
                          alt=""
                        />
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReplyTweetCard;
