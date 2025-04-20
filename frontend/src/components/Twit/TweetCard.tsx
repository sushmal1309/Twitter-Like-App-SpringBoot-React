import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { useState } from "react";
import RepeatIcon from "@mui/icons-material/Repeat";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import UpdateTweetModal from "./UpdateTweetModal";
import ReplyModal from "../Reply/ReplyModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tweetMSURL } from "../portsFolder/portNoForMs";
type TweetState = {
  profileData: any;
  tweetItem: any;
  onDelete: any;
  onUpdate: any;
};
const TweetCard: React.FC<TweetState> = ({
  profileData,
  tweetItem,
  onDelete,
  onUpdate,
}) => {
  const tweetURL = tweetMSURL;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [updateTweet, setUpdateTweet] = useState(false);
  const openDeleteMenu = Boolean(anchorEl);
  const [like, setLike] = useState(false);
  const handleOpenDeleteMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDeleteMenu = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  function handleDeleteTweet(tweetId: number) {
    axios
      .delete(tweetURL + "/delete/" + tweetId)
      .then((response) => {
        console.log(response);
        onDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleUpdateTweet() {
    setUpdateTweet((update) => !update);
  }
  function handleUpdate() {
    onUpdate();
  }

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
  const dispatch = useDispatch();

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
  function handleLikeClick() {
    setLike((like) => !like);
    console.log(like);
    if (like) {
      axios
        .put(tweetURL + "/dislike/" + tweetItem.tweetId)
        .then((res) => {
          const count = res.data;
          console.log(count);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(tweetURL + "/like/" + tweetItem.tweetId)
        .then((res) => {
          const count = res.data;
          console.log(count);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  const handleCloseReplyModel = () => setOpenReplyModel(false);
  const [openReplyModel, setOpenReplyModel] = useState<Boolean>();
  const handleOpenReplyModel = () => setOpenReplyModel(true);
  function handleTweetPageClick() {
    dispatch({
      type: "REPLY_DATA",
      payload: { tweetData: tweetItem, userData: profileData },
    });
    navigate(
      "/home/replyTweetPage/" + tweetItem.tweetId + "/" + tweetItem.userId
    );
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
    <div className="d-flex gap-4 mt-4">
      <Avatar
        alt="Avatar"
        src={profileData.profilePicture}
        className="cursor-pointer"
        onClick={() => handleProfileClick(profileData.userId)}
      />
      <div className="w-100">
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
            <span>{formatTweetTimestamp(new Date(tweetItem.updatedAt))}</span>
          </div>
          <div>
            <Button onClick={handleOpenDeleteMenu}>
              <MoreHorizIcon
                id="basic-button"
                aria-controls={openDeleteMenu ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openDeleteMenu ? "true" : undefined}
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
              <MenuItem
                onClick={() => {
                  handleDeleteTweet(tweetItem.tweetId);
                }}
              >
                Delete
              </MenuItem>

              <MenuItem onClick={handleUpdateTweet}>Update</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="mt-2 ">
          <div className="cursor-pointer" onClick={handleTweetPageClick}>
            <p className="mb-2 p-0 " onClick={handleTweetPageClick}>
              {tweetItem.tweetContent}
            </p>
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
          <div className="py-5 d-flex flex-wrap justify-content-start gap-5 align-items-center">
            <div className="gap-2 d-flex align-items-center text-secondary">
              <ChatBubbleOutlineIcon
                className="cursor-pointer"
                onClick={handleOpenReplyModel}
              />
            </div>
            <div
              className={`${
                true ? "text-primary" : "text-secondary"
              } gap-3 d-flex align-items-center`}
            >
              <RepeatIcon className={` cursor-pointer`} />
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
      {updateTweet && (
        <UpdateTweetModal
          open={updateTweet}
          handleClose={handleUpdateTweet}
          tweetData={tweetItem}
          profileData={profileData}
          onUpdateTweet={handleUpdate}
        />
      )}
      {openReplyModel && (
        <ReplyModal
          tweetItem={tweetItem}
          profileData={profileData}
          handleClose={handleCloseReplyModel}
          open={openReplyModel}
        />
      )}
    </div>
  );
};
export default TweetCard;
