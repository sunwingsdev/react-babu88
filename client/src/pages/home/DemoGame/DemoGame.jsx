import { useGetGamesQuery } from "@/redux/features/allApis/gameApi/gameApi";
import { useParams } from "react-router-dom";

const DemoGame = () => {
  const { id } = useParams();
  const { data: games, isLoading } = useGetGamesQuery();
  const selectedGame = games?.find((game) => game._id == id);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedGame) return <div>Game not found</div>;
  return (
    <div>
      <iframe
        className="w-full max-h-[700px] h-[700px]"
        src={selectedGame?.link}
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default DemoGame;
