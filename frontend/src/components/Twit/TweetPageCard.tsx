import React, { useState } from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Avatar } from "@mui/material";

import ReplyModal from "../Reply/ReplyModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { tweetMSURL } from "../portsFolder/portNoForMs";
import RetweetModal from "../Reply/RetweetModal";
type TweetPageCard = {
  profileData: any;
  tweetItem: any;
};

const TweetPageCard: React.FC<TweetPageCard> = ({ profileData, tweetItem }) => {
  const tweetURL = tweetMSURL;

  const dispatch = useDispatch();
  console.log(profileData);
  console.log(tweetItem);
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
  const [like, setLike] = useState(false);

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
  const [openRetweetModel, setOpenRetweetModel] = useState<Boolean>();
  const handleCloseReplyModel = () => setOpenReplyModel(false);
  const [openReplyModel, setOpenReplyModel] = useState<Boolean>();
  const handleOpenReplyModel = () => {
    console.log("reply");
    setOpenReplyModel(true);
  };
  const handleCloseRetweetModel = () => setOpenRetweetModel(false);
  const handleOpenRetweetModel = () => {
    console.log("retweet");
    setOpenRetweetModel(true);
  };
  function handleTweetPageClick() {
    dispatch({
      type: "REPLY_DATA",
      payload: { tweetData: tweetItem, userData: profileData },
    });
    navigate(
      "/home/replyTweetPage/" + tweetItem.tweetId + "/" + tweetItem.userId
    );
  }
  function handleLikeClick() {
    setLike((like) => !like);
    console.log(like);
    if (like) {
      axios
        .put(tweetURL + "/dislike/" + tweetItem.tweetId)
        .then((res) => {
          const count = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(tweetURL + "/like/" + tweetItem.tweetId)
        .then((res) => {
          const count = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
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

  return (
    <>
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
                  {formatTweetTimestamp(new Date(tweetItem.updatedAt))}
                </span>
              </div>
            </div>
            <div className="mt-2 ">
              <div className="cursor-pointer" onClick={handleTweetPageClick}>
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
                    }
                  })}
              </div>
              <div className="py-5 d-flex flex-wrap justify-content-start gap-5 align-items-center">
                <div className="gap-2 d-flex align-items-center text-secondary">
                  <ChatBubbleOutlineIcon
                    className="cursor-pointer"
                    onClick={handleOpenReplyModel}
                  />
                </div>
                <div className="gap-2 d-flex align-items-center text-secondary">
                  <RepeatIcon
                    className="cursor-pointer"
                    onClick={handleOpenRetweetModel}
                  />
                </div>
                <div
                  className={`${
                    true ? "text-primary" : "text-secondary"
                  } gap-3 d-flex align-items-center`}
                  onClick={handleLikeClick}
                >
                  {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  {<p className="mb-0">{tweetItem.likes + Number(like)}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {openReplyModel && (
          <ReplyModal
            tweetItem={tweetItem}
            profileData={profileData}
            handleClose={handleCloseReplyModel}
            open={openReplyModel}
          />
        )}
        {openRetweetModel && (
          <RetweetModal
            tweetItem={tweetItem}
            profileData={profileData}
            handleClose={handleCloseRetweetModel}
            open={openRetweetModel}
          />
        )}
      </div>
    </>
  );
};
export default TweetPageCard;
