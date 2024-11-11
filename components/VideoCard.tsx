import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { icons } from "@/constants";
import { ResizeMode, Video, AVPlaybackStatus } from "expo-av";

interface VideoProps {
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}: {
  video: VideoProps;
}) => {
  const [play, setPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<Video>(null);

  const handlePlayback = async () => {
    try {
      setIsLoading(true);
      setPlay(true);

      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        console.log("Video Status:", status);

        // Explicitly load the video
        await videoRef.current.loadAsync(
          { uri: video },
          { shouldPlay: true },
          false
        );
      }
    } catch (error) {
      console.error("Video playback error:", error);
      Alert.alert(
        "Playback Error",
        "Unable to play video. Please check your internet connection and try again."
      );
      setPlay(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaybackStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      // Handle error state
      console.log("Video failed to load:", status);
      return;
    }

    console.log("Playback Status:", {
      isPlaying: status.isPlaying,
      position: status.positionMillis,
      duration: status.durationMillis,
      isBuffering: status.isBuffering,
    });

    if (status.didJustFinish) {
      setPlay(false);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 font-pregular text-xs"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <Video
          ref={videoRef}
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onLoadStart={() => console.log("Video load started")}
          onLoad={(status) => console.log("Video loaded:", status)}
          onError={(error) => console.error("Video error:", error)}
          onPlaybackStatusUpdate={handlePlaybackStatus}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePlayback}
          className="w-full h-60 rounded-xl relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          {isLoading ? (
            <Text className="text-white absolute">Loading...</Text>
          ) : (
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
