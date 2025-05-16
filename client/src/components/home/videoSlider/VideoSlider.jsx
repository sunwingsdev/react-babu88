import { useState, useEffect } from "react";

const VideoSlider = () => {
  const bannerImages = [
    {
      id: 1,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-66c442ab4e9f9.jpg",
      videoId: "https://youtu.be/UwnS-ATONek",
    },
    {
      id: 2,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-66c2c5680c279.jpg",
      videoId: "https://youtu.be/dQw4w9WgXcQ",
    },
    {
      id: 3,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-65938d6405590.jpg",
      videoId: "https://youtu.be/UwnS-ATONek",
    },
    {
      id: 4,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-669769f71da59.jpg",
      videoId: "https://youtu.be/dQw4w9WgXcQ",
    },
    {
      id: 5,
      image:
        "https://jiliwin.9terawolf.com/cms/banner/image/bd-desktop-667e3b922437d.jpg",
      videoId: "https://youtu.be/UwnS-ATONek",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
        setFade(true);
      }, 300); // This matches the transition duration
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300);
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const currentSlide = bannerImages[currentIndex];

  return (
    <div className="relative w-full h-80 hidden md:block">
      {/* Main content with fade transition */}
      <div
        className={`relative h-full transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-90"
        }`}
      >
        <img
          className="h-full w-full object-fit rounded-lg"
          src={currentSlide.image}
          alt={`Banner ${currentSlide.id}`}
        />
        {currentSlide.videoId && (
          <iframe
            className="absolute py-4 h-full w-[40%] bottom-0 right-0 rounded-md"
            src={getYouTubeEmbedUrl(currentSlide.videoId)}
            title={`YouTube video ${extractYouTubeId(currentSlide.videoId)}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-4 left-8 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`size-[10px] md:size-4 rounded-full hover:bg-yellow-400 transition-colors ease-in-out duration-300 ${
              currentIndex === index ? "bg-yellow-400" : "bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;
