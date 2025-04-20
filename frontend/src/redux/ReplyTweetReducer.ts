const initialState = {
  replys: { tweetData: {}, userData: {} },
};

export const ReplyTweetDataReducer = (state = initialState, action: any) => {
  console.log(action.type);
  switch (action.type) {
    case "REPLY_DATA":
      console.log(action.payload);
      return {
        ...state,
        replys: {
          tweetData: action.payload.tweetData,
          userData: action.payload.userData,
        },
      };
    default:
      return state;
  }
};

export default ReplyTweetDataReducer;
