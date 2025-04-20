type Profile = {
  bio: string;
  coverPhoto: string;
  dateOfBirth: string;
  emailId: string;
  firstName: string;
  joinedDate: string;
  lastName: string;
  location: string;
  profilePicture: string;
  userId: 0;
  website: string;
};
type FollowState = {
  following: {
    followingProfiles: any[];
    tweets: Record<string, any[]>;
  };
};

const initialState: FollowState = {
  following: {
    followingProfiles: [],
    tweets: {},
  },
};

export const FollowingTweetDataReducer = (
  state = initialState,
  action: any
) => {
  console.log(action);
  switch (action.type) {
    case "FOLLOWING_TWEET_DATA":
      console.log(action.payload);
      const { userData, tweetData } = action.payload;

      return {
        ...state,
        following: {
          followingProfiles: [...state.following.followingProfiles, userData],
          tweets: { ...state.following.tweets, [userData.userId]: tweetData },
        },
      };
    default:
      return state;
  }
};

export default FollowingTweetDataReducer;
