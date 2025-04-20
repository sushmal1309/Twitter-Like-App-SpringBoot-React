import { Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReplyTweetCard from "./ReplyTweetCard";

import ReplyTweetDetail from "./ReplyTweetDetail";
import { tweetMSURL, userMSURL } from "../portsFolder/portNoForMs";
const ReplyTweetPage: React.FC = () => {
  const { tweetId, userId } = useParams();

  const tweetURL = tweetMSURL;
  const userUrl = userMSURL;
  const token = localStorage.getItem("token");

  const [tweetProfileData, setTweetProfileData] = useState({});
  const [tweetInfoForUser, setTweetInfoForUser] = useState({});
  const [replyTweetData, setReplyTweetData] = useState([]);

  const fetchTweetReplyData = async () => {
    axios
      .get(tweetURL + "/reply/" + tweetId)
      .then(async (response) => {
        console.log(response);

        setReplyTweetData(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  function fetchData() {
    axios
      .get(userUrl + "/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setTweetProfileData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchTweetData() {
    axios
      .get(tweetURL + "/tweet/" + tweetId)
      .then((response) => {
        console.log(response.data);
        setTweetInfoForUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchTweetReplyData();
    fetchData();
    fetchTweetData();
  }, [tweetId, userId]);
  return (
    <div>
      {tweetProfileData && tweetInfoForUser && (
        <ReplyTweetDetail
          profileData={tweetProfileData}
          tweetItem={tweetInfoForUser}
        />
      )}
      <Divider sx={{ margin: "3rem 0rem", backgroundColor: "black" }} />
      {replyTweetData.map((replyTweetData: any, index: any) => (
        <ReplyTweetCard replyTweetData={replyTweetData} key={index} />
      ))}
    </div>
  );
};
export default ReplyTweetPage;
