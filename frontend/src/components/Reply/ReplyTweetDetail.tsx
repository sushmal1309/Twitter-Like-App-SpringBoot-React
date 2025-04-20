import { Avatar } from "@mui/material";

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
type ReplyPageCard = {
  profileData: any;
  tweetItem: any;
};
const ReplyTweetDetail: React.FC<ReplyPageCard> = ({
  profileData,
  tweetItem,
}) => {
  const dispatch = useDispatch();

  const userId = localStorage.getItem("user");

  const navigate = useNavigate();
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
  function handleTweetPageClick() {
    dispatch({
      type: "REPLY_DATA",
      payload: { tweetData: tweetItem, userData: profileData },
    });
    navigate(
      "/home/replyTweetPage/" + tweetItem.tweetId + "/" + tweetItem.userId
    );
  }
  function handleProfileClick(id: string) {
    if (id == userId) {
      navigate("/home/profile");
    } else {
      navigate("/home/profile/" + id);
    }
  }
  return (
    <>
      {profileData && (
        <div className="container-fluid mt-2">
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
              <div
                className="d-flex justify-content-between align-items-center "
                onClick={() => handleProfileClick(profileData.userId)}
              >
                <div className="d-flex cursor-pointer align-items-center gap-4">
                  <span className="text-dark" style={{ fontWeight: "700" }}>
                    {profileData.firstName} {profileData.lastName}
                  </span>
                  <span className=" text-gray-600">
                    @{profileData.firstName}
                    {"_"}
                    {profileData.lastName} ·{" "}
                  </span>
                  <span>
                    {tweetItem.updatedAt &&
                      formatTweetTimestamp(new Date(tweetItem.updatedAt))}
                  </span>
                </div>
              </div>
              <div className="mt-2 ">
                <div className="cursor-pointer" onClick={handleTweetPageClick}>
                  <p className="mb-2 p-0 ">
                    {tweetItem && tweetItem.tweetContent}
                  </p>
                  {tweetItem &&
                    tweetItem.media &&
                    tweetItem?.media.length > 0 &&
                    tweetItem.media.map((media: any) => {
                      if (media.mediaType === "IMAGE") {
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
      )}
    </>
  );
};
export default ReplyTweetDetail;
