"use client";
import { useState } from "react";
import axios from "axios";
import { useStory } from "../contexts/StoryContext";
import StarsLoader from "./StarsLoader";
import "../globals.css";

export default function StoryInput() {
  const {
    storyType,
    setStoryType,
    storyHappening,
    setStoryHappening,
    handleStorySubmit,
  } = useStory();
  const [isLoading, setIsLoading] = useState(false);

  const fetchStory = async () => {
    try {
      setIsLoading(true);
      const storyResponse = await fetch("http://localhost:3008/storyTeller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyType, storyHappening }),
      });
      const storyData = await storyResponse.json();
      const storyText = storyData.story;

      const imageResponse = await axios.post(
        "http://localhost:3008/generateImage",
        {
          prompt: storyHappening,
        }
      );
      const imageUrl = imageResponse.data.image_url;
      handleStorySubmit(storyText, imageUrl);
    } catch (error) {
      console.error("Error fetching story: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <StarsLoader count={8} />
      ) : (
        <div
          className=" text-center flex flex-col h-[600px] justify-between"
          style={{
            backgroundImage: "url('/bg_hearts.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col">
            <h2 className="mb-8 text-[#2f856b] text-2xl font-bold">
              Generate a Story
            </h2>
            <input
              type="text"
              value={storyType}
              onChange={(e) => setStoryType(e.target.value)}
              placeholder="Enter a story type"
              className="p-2 mb-4 focus:outline-none bg-[#fff0eb] text-black border-[2px] border-solid shadow-md shadow-gray-400 border-[#2f856b]"
            />
            <input
              type="text"
              value={storyHappening}
              onChange={(e) => setStoryHappening(e.target.value)}
              placeholder="What is the main event?"
              className="p-2 mb-4 focus:outline-none bg-[#fff0eb] text-black border-[2px] border-solid shadow-md shadow-gray-400 border-[#2f856b]"
            />
          </div>
          <div>
            <button
              onClick={fetchStory}
              className="p-3 bg-[#9bf2d9] text-black border-[2px] border-solid shadow-md shadow-gray-400 border-[#2f856b]"
            >
              Tell Me a Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
