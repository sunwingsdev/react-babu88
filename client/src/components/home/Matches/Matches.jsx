import rcb from "@/assets/matches/rcb.png";
import kkr from "@/assets/matches/kkr.png";
import dc from "@/assets/matches/dc.png";
import gt from "@/assets/matches/gt.png";
import kk from "@/assets/matches/kk.png";
import lq from "@/assets/matches/lq.png";
import ms from "@/assets/matches/ms.png";
import pk from "@/assets/matches/pk.png";
import pz from "@/assets/matches/pz.png";
import qg from "@/assets/matches/qg.png";
import rr from "@/assets/matches/rr.png";
import uae from "@/assets/matches/uae.png";
import bd from "@/assets/matches/bd.png";

const Matches = () => {
  const matches = [
    {
      league: "Indian Premier League",
      date: "May 17, 2025 20:00:00",
      team1: "Royal Challengers Bengaluru",
      team2: "Kolkata Knight Riders",
      teamImage1: rcb,
      teamImage2: kkr,
    },
    {
      league: "Pakistan Super League",
      date: "May 17, 2025 20:30:00",
      team1: "Peshawar Zalmi",
      team2: "Karachi Kings",
      teamImage1: pz,
      teamImage2: kk,
    },
    {
      league: "Twenty20 International",
      date: "May 17, 2025 21:00:00",
      team1: "United Arab Emirates",
      team2: "Bangladesh",
      teamImage1: uae,
      teamImage2: bd,
    },
    {
      league: "Pakistan Super League",
      date: "May 18, 2025 16:00:00",
      team1: "Multan Sultans",
      team2: "Quetta Gladiators",
      teamImage1: ms,
      teamImage2: qg,
    },
    {
      league: "Indian Super League",
      date: "May 18, 2025 16:00:00",
      team1: "Rajasthan Royals",
      team2: "Punjab Kings",
      teamImage1: rr,
      teamImage2: pk,
    },
    {
      league: "Indian Super League",
      date: "May 18, 2025 16:00:00",
      team1: "Delhi Capitals",
      team2: "Gujarat Titans",
      teamImage1: dc,
      teamImage2: gt,
    },
    {
      league: "Pakistan Super League",
      date: "May 18, 2025 16:00:00",
      team1: "Peshawar Zalmi",
      team2: "Lahore Qalandars",
      teamImage1: pz,
      teamImage2: lq,
    },
  ];

  return (
    <div
      style={{ scrollbarWidth: "thin", scrollbarColor: "#ffce01 #f3f4f6" }}
      className="hidden  bg-white p-4 font-sans md:flex gap-6 overflow-x-auto "
    >
      {matches.map((match, index) => (
        <div
          key={index}
          className="min-w-[280px] rounded-lg shadow-sm shadow-gray-500 pb-3 "
        >
          <div className="bg-[#ffce01] flex items-center gap-2 p-2 rounded-t-lg text-sm">
            <p className="bg-black px-1 text-white rounded-lg">Upcoming</p>
            <h2 className="font-medium">{match.league}</h2>
          </div>
          <div className="px-2 text-sm">
            <p className="text-[#959595] text-base py-1">{match.date}</p>
            <div className="flex items-center gap-2 mb-2">
              <img className="size-10" src={match?.teamImage1} alt="" />
              <p className="line-clamp-1">{match.team1}</p>
            </div>
            <div className="flex items-center gap-2">
              <img className="size-10" src={match?.teamImage2} alt="" />
              <p className="line-clamp-1">{match.team2}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Matches;
