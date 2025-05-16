const HomeMobileButton = ({ image, title, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`min-w-[74px] text-left whitespace-nowrap p-2 text-xs font-medium rounded-sm transition-all duration-300 ${
        isActive 
          ? 'text-black bg-yellow-400' 
          : 'text-white bg-[#333] hover:text-black hover:bg-yellow-400'
      }`}
    >
      <img className="w-7 mb-1" src={image} alt="" />
      {title}
    </button>
  );
};

export default HomeMobileButton;