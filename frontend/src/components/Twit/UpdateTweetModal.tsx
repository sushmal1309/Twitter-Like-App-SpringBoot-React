import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import React, { useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tweetMSURL } from "../portsFolder/portNoForMs";
type UpdateTweet = {
  open: any;
  handleClose: any;
  tweetData: any;
  profileData: any;
  onUpdateTweet: any;
};

const UpdateTweetModal: React.FC<UpdateTweet> = ({
  open,
  handleClose,
  tweetData,
  profileData,
  onUpdateTweet,
}) => {
  const [updateTweetData, setUpdateTweetData] = useState(tweetData);
  const tweetURL = tweetMSURL;
  const [valid, setValid] = useState(true);
  const [emojiOpen, setEmojiOpen] = useState(false);

  function handleOpenEmoji() {
    setEmojiOpen((open) => !open);
  }
  function handleEmojiClick(value: any) {
    const { emoji } = value;

    handleEmojiChange("tweetContent", emoji);
  }
  function handleEmojiChange(name: string, value: string) {
    setUpdateTweetData((prev: any) => {
      const data = prev.tweetContent + value;
      if (data.length > 280) {
        setValid(false);
      } else {
        setValid(true);
      }

      return { ...prev, [name]: prev.tweetContent + value };
    });
  }
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function handleImageChange(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Convert and store Base64 image
      const base64 = await convertToBase64(file);

      const updateMedia = updateTweetData.media;
      updateMedia.push({
        mediaType: type,
        mediaUrl: base64,
        createdAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
      });
      setUpdateTweetData((data: any) => ({ ...data, media: updateMedia }));
    }
  }
  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(updateTweetData);
    const updatedData = {
      ...updateTweetData,
      updatedAt: new Date(new Date().getTime() + (5 * 60 + 30) * 60 * 1000),
    };

    axios
      .put(tweetURL + "/update/" + updateTweetData.tweetId, updatedData)
      .then((response) => {
        console.log(response);
        onUpdateTweet();
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name === "tweetText") {
      if (value.length > 127) {
        setValid(false);
      } else {
        setValid(true);
      }
    }
    setUpdateTweetData((data: any) => ({ ...data, [name]: value }));
  }
  function handleDeleteMedia(mediaId: number, mediaUrl: string) {
    const media = updateTweetData.media;
    let updatedMedia: any = null;
    if (mediaId) {
      updatedMedia = media.map((data: any) => {
        if (data.mediaId === mediaId) {
          return { ...data, mediaUrl: "", isDelete: true };
        } else {
          return data;
        }
      });
    } else {
      updatedMedia = media.filter((data: any) => data.mediaUrl !== mediaUrl);
    }

    console.log(updatedMedia);
    setUpdateTweetData((data: any) => ({ ...data, media: updatedMedia }));
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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        Edit Tweet
      </DialogTitle>
      <DialogContent>
        <div className="d-flex gap-3">
          <Avatar
            alt="Avatar"
            src={profileData.profilePicture}
            onClick={() => handleProfileClick(profileData.userId)}
          />
          <div className="w-100">
            <form onSubmit={handleSubmit}>
              <div>
                <textarea
                  className="form-control border-0 bg-transparent fs-5 focus-ring-0 shadow-none"
                  placeholder="What is Happening"
                  maxLength={280}
                  onChange={handleChange}
                  name="tweetContent"
                  value={updateTweetData.tweetContent}
                />
                <span>
                  {updateTweetData.tweetContent &&
                    280 - updateTweetData.tweetContent.length}
                  /{280} characters remaining
                </span>
              </div>
              {updateTweetData.media.length > 0 &&
                updateTweetData.media.map((media: any) => {
                  if (media.mediaUrl !== "" && media.mediaType === "IMAGE") {
                    return (
                      <div className="position-relative">
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() =>
                            handleDeleteMedia(media.mediaId, media.mediaUrl)
                          }
                          aria-label="close"
                          className="position-absolute top-0 end-0 "
                          style={{ marginRight: "250px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <img
                          className="w-[40rem] border border-gray-400 p-4 rounded-md"
                          src={media.mediaUrl}
                          alt=""
                        />
                      </div>
                    );
                  } else if (
                    media.mediaUrl !== "" &&
                    media.mediaType === "VIDEO"
                  ) {
                    return (
                      <div className="position-relative">
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() =>
                            handleDeleteMedia(media.mediaId, media.mediaUrl)
                          }
                          aria-label="close"
                          className="position-absolute top-0 end-0 "
                          style={{ marginRight: "250px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <video
                          controls
                          className="w-[40rem] border border-gray-400 p-4 rounded-md"
                          src={media.mediaUrl}
                        />
                      </div>
                    );
                  }
                })}
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
                      onChange={(e) => handleImageChange(e, "IMAGE")}
                    />
                  </label>
                  <label className="flex align-items-center gap-2  rounded-md cursor-pointer">
                    <SlideshowIcon className="text-primary" />
                    <input
                      type="file"
                      accept="video/mp4, video/webm"
                      name="video"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, "VIDEO")}
                    />
                  </label>

                  <div className="position-relative">
                    <TagFacesIcon
                      onClick={handleOpenEmoji}
                      className="text-primary cursor-pointer"
                    />
                    {emojiOpen && (
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
                    Update Tweet
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateTweetModal;
