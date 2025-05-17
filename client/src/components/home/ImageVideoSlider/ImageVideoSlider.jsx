import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const ImageVideoSlider = () => {
  const { addToast } = useToasts();
  const slides = [
    {
      id: 1,
      videoId: "https://youtu.be/UwnS-ATONek",
    },
    {
      id: 2,
      videoId: "https://youtu.be/dQw4w9WgXcQ",
    },
    {
      id: 3,
      videoId: "https://youtu.be/example3",
    },
    {
      id: 4,
      videoId: "https://youtu.be/example4",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [featuresImage, setFeaturesImage] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch features image
  useEffect(() => {
    const fetchFeaturesImage = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/features-image`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch features image");
        }
        const data = await response.json();
        setFeaturesImage(data.features || "");
      } catch (err) {
        console.error("Fetch error:", err);
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
        setFeaturesImage("");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturesImage();
  }, [addToast, baseURL]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

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

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto md:hidden">
      {/* Image section with relative positioning for buttons */}
      <div className="relative">
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-t-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : featuresImage ? (
          <div className={`transition-opacity duration-300`}>
            <img
              className="w-full h-64 object-cover rounded-t-xl"
              src={`${baseURL}${featuresImage}`}
              alt={`Slide ${currentSlide.id}`}
            />
          </div>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-t-xl">
            <p className="text-gray-600 text-sm">No features image available</p>
          </div>
        )}

        {/* Navigation buttons positioned at bottom-left of image */}
        <div className="absolute bottom-2 left-2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? "bg-yellow-500" : "bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Video section (bottom) */}
      <div
        className={`bg-gray-900 rounded-b-xl overflow-hidden transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentSlide.videoId && (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-64"
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                currentSlide.videoId
              )}`}
              title={`YouTube video ${currentSlide.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageVideoSlider;