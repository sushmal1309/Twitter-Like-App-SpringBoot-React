import React, { useState } from "react";
import { useSelector } from "react-redux";

import TweetPageCard from "./TweetPageCard";
import { LocalizationProvider } from "@mui/lab";
import DateRangeIcon from "@mui/icons-material/DateRange";

const TweetPage: React.FC = () => {
  const state = useSelector((state: any) => state.TweetReducer.tweets);
  const tweets = state.tweets;
  // const [filteredTweets, setFilteresTweets] = useState(tweets);
  // const[]
  const [loading, setLoading] = useState(false);

  const userIdsProfileData = state.userIdsProfileData;
  let filteredTweets = tweets;
  let filterUserProfile = userIdsProfileData;
  const [filteredTweetsState, setFilteredTweetsState] = useState(tweets);
  const [filteredUserProfileState, setFilteredProfileState] =
    useState(userIdsProfileData);
  const [openCalender, setOpenCalender] = useState(false);
  function handleDatePicker() {
    setOpenCalender((open) => !open);
  }
  async function handleDateChange(e: any) {
    console.log(e.target.value);
    if (e.target.value === "") {
      filteredTweets = tweets;
      filterUserProfile = userIdsProfileData;
      setFilteredTweetsState(tweets);
      setFilteredProfileState(userIdsProfileData);
      return;
    }
    filteredTweets = tweets.filter((ele: any) => {
      console.log(ele);
      return ele.updatedAt.substring(0, 10) == e.target.value;
    });
    filterUserProfile = [];
    filteredTweets.forEach((ele: any) => {
      let userProfile = userIdsProfileData.find(
        (profile: any) => profile.userId == ele.userId
      );
      filterUserProfile.push(userProfile);
    });

    setFilteredProfileState(filterUserProfile);
    setFilteredTweetsState(filteredTweets);
    console.log(filterUserProfile);
    console.log(filteredTweets);
  }
  if (filterUserProfile.length !== filteredTweets.length) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Tweets</h4>
        <label className="flex align-items-center gap-2  rounded-md cursor-pointer">
          <DateRangeIcon className="text-primary" onClick={handleDatePicker} />
          {openCalender && (
            <input
              type="date"
              // accept="video/mp4, video/webm"
              // name="video"
              // style={{ display: "none" }}
              onChange={handleDateChange}
            />
          )}
        </label>
      </div>
      {filteredTweetsState.length > 0 ? (
        filteredTweetsState.map((tweetItem: any, index: number) => (
          <TweetPageCard
            tweetItem={tweetItem}
            profileData={filteredUserProfileState[index]}
          />
        ))
      ) : (
        <div
          className="text-center text-dark"
          style={{ fontWeight: "700", fontSize: "30px" }}
        >
          No Tweets Found
        </div>
      )}
    </div>
  );
};
export default TweetPage;
