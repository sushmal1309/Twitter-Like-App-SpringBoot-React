import React from "react";
const TwitterImage: React.FC = () => {
  return (
    <React.Fragment>
      <div className="col-md-7 p-0">
        <img
          src="images/twitterbg.jpg"
          alt="twitterimg"
          className="img-fluid"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </React.Fragment>
  );
};
export default TwitterImage;
