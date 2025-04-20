const initialState = {
  tweets: { tweets: [], userIdsProfileData: [] },
};

export const TweetReducer = (state = initialState, action: any) => {
  // console.log(action.type);
  switch (action.type) {
    case "TWEET_DATA":
      console.log(action.payload);
      return {
        ...state,
        tweets: {
          tweets: action.payload.tweets,
          userIdsProfileData: action.payload.userIdsProfileData,
        },
      };
    default:
      return state;
  }
};

export default TweetReducer;
