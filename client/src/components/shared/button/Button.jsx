import { useSelector } from "react-redux";

const Button = ({ nameText }) => {

    const { mainColor , backgroundColor } = useSelector((state) => state.themeColor);


  return (
    <div>
      <button className={`py-2 px-4 xl:px-6 whitespace-nowrap text-base font-semibold hover:bg-${backgroundColor} rounded-full transition-all duration-500`} style={{color: mainColor}}>
        {nameText}
      </button>
    </div>
  );
};

export default Button;
