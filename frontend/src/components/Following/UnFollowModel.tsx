import { Avatar, Dialog, DialogContent } from "@mui/material";
import React from "react";
type UnFollow = {
  open: any;
  profileData: any;
  handleUnFollow: any;
  handleClose: any;
};
const UnFollowModel: React.FC<UnFollow> = ({
  open,
  profileData,
  handleUnFollow,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogContent className="pr-2">
        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-2">
              <Avatar
                alt="Avatar"
                src={profileData.profilePicture}
                className="cursor-pointer"
              />
            </div>
            <div className="col-10">
              <div className="d-flex justify-content-between align-items-center ">
                <div className="d-flex flex-column cursor-pointer align-items-center gap-1">
                  <span className="text-dark" style={{ fontWeight: "700" }}>
                    {profileData.firstName} {profileData.lastName}
                  </span>
                  <span className=" text-gray-600">
                    @{profileData.firstName}
                    {"_"}
                    {profileData.lastName} ·{" "}
                  </span>
                </div>
              </div>
              <div className="mt-3 d-flex flex-column gap-2">
                <button className="btn btn-primary" onClick={handleUnFollow}>
                  UNFOLLOW
                </button>
                <button className="btn btn-dark" onClick={handleClose}>
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UnFollowModel;
