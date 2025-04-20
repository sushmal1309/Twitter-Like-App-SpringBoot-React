import { Grid } from "@mui/material";
import React, { lazy, Suspense, useEffect } from "react";
import Navigation from "./Navigation";
import { Route, Routes, useNavigate } from "react-router-dom";
import RightPart from "./RightPart";

const LazyTwitSection = lazy(() => import("../components/Twit/TwitSection"));
const LazyUserProfile = lazy(() => import("./UserProfile"));

const LazyTweetPage = lazy(() => import("../components/Twit/TweetPage"));
const LazyReplyTweetPage = lazy(
  () => import("../components/Reply/ReplyTweetPage")
);
const LazyProfile = lazy(() => import("./Profile"));
const Home: React.FC = () => {
  const theme = "dark";
  const isUserLoggedIn = localStorage.getItem("token");

  const navigate = useNavigate();
  useEffect(() => {
    try {
      if (!isUserLoggedIn) navigate("/"); //change
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Grid container className="px-4 lg:px-36 justify-between" xs={12}>
      <Grid item xs={0} lg={2.5} className="hidden lg:block  w-full relative">
        <Navigation />
      </Grid>
      <Grid
        item
        xs={12}
        lg={6}
        className={`px-5 lg:px-9 border ${
          theme === "dark" ? "border-gray-800" : ""
        } `}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyTwitSection />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyProfile />
              </Suspense>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyUserProfile />
              </Suspense>
            }
          />
          <Route
            path="/tweetPage"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyTweetPage />
              </Suspense>
            }
          />
          <Route
            path="/replyTweetPage/:tweetId/:userId"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyReplyTweetPage />
              </Suspense>
            }
          />
        </Routes>
      </Grid>
      <Grid item xs={0} lg={3.5} className="hidden lg:block ">
        <RightPart />
      </Grid>
    </Grid>
  );
};
export default Home;
