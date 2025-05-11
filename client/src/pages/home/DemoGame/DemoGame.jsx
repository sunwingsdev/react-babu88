import { useParams } from "react-router-dom";
const games = [
  { id: 1, demo: "https://demo.spribe.io/launch/aviator?currency=BDT&lang=EN" },
];
const DemoGame = () => {
  const { id } = useParams();
  const selectedGame = games.find((game) => game.id == id);
  return (
    <div>
      <iframe
        className="w-full max-h-[700px] h-[700px]"
        src={selectedGame?.demo}
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default DemoGame;
