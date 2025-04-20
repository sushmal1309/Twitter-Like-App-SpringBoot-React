import { Avatar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
type Following = {
  profileData: any;
};
const FollowingSection: React.FC<Following> = ({ profileData }) => {
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
    <div
      className="d-flex gap-3 mt-3 ms-2 justify-content-between"
      onClick={() => handleProfileClick(profileData.userId)}
    >
      <Avatar
        alt="Avatar"
        src={profileData.profilePicture}
        className="cursor-pointer"
      />
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-md-10">
            {" "}
            <span className="text-dark" style={{ fontWeight: "700" }}>
              {profileData.firstName} {profileData.lastName}
            </span>
            <span className=" text-secondary">
              @{profileData.firstName}
              {"_"}
              {profileData.lastName}.
            </span>
            <p className="mb-0">{profileData.bio}</p>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary">Following</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FollowingSection;
