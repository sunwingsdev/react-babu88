import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const VideoSlider = () => {
  const bannerImages = [
    {
      id: 1,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-66c442ab4e9f9.jpg",
      videoId: "https://youtu.be/UwnS-ATONek", // Full share link
    },
    {
      id: 2,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-66c2c5680c279.jpg",
      videoId: "https://youtu.be/dQw4w9WgXcQ", // Example share link
    },
    {
      id: 3,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-65938d6405590.jpg",
    },
    {
      id: 4,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-669769f71da59.jpg",
    },
    {
      id: 5,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-667e3b922437d.jpg",
    },
  ];

  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Listen for the selected slide change
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Scroll to the next slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (api) {
        const nextIndex = (selectedIndex + 1) % bannerImages.length;
        api.scrollTo(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api, selectedIndex, bannerImages.length]);

  const scrollTo = (index) => {
    api?.scrollTo(index);
  };

  // Function to extract YouTube ID from various URL formats
  const extractYouTubeId = (url) => {
    if (!url) return null;

    // Regular YouTube links
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    // Short youtu.be links
    const shortLinkRegex = /youtu.be\/([^#&?]*)/;
    const shortMatch = url.match(shortLinkRegex);

    if (shortMatch && shortMatch[1].length === 11) {
      return shortMatch[1];
    }

    return null;
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {bannerImages.map((image) => (
          <CarouselItem key={image.id}>
            <div className="relative">
              <div className="relative">
                <img
                  className="h-56 object-cover rounded-lg"
                  src={image.image}
                  alt={`Banner ${image.id}`}
                />
                {/* Slide Select Buttons */}
                <div className="absolute bottom-3 md:bottom-4 left-6 md:left-8 flex space-x-2">
                  {bannerImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`size-[10px] md:size-4 rounded-full hover:bg-yellow-400 transition-colors ease-in-out duration-300 ${
                        selectedIndex === index ? "bg-yellow-400" : "bg-white"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              {image.videoId && (
                <iframe
                  className="md:absolute w-full md:w-fit h-56 bottom-0 right-0 rounded-xl mt-4 md:mt-0"
                  src={getYouTubeEmbedUrl(image.videoId)}
                  title={`YouTube video ${extractYouTubeId(image.videoId)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default VideoSlider;
