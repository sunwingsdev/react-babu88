import { FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import RightItem from "./RightItem";
import axios from "axios";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";



const Deposit = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Selected promotion
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Selected payment method
  const [selectedChannel, setSelectedChannel] = useState(null); // Selected channel
  const [amount, setAmount] = useState(""); // Deposit amount
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timer, setTimer] = useState(1200); // 20 minutes in seconds
  const [userInputs, setUserInputs] = useState({}); // Store user input values
const { addToast } = useToasts();


  const { user } = useSelector((state) => state.auth);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentMethodsRes = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/depositPaymentMethod/deposit-methods`);
        setPaymentMethods(paymentMethodsRes.data.data);

        const promotionsRes = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/depositPromotions/deposit-promotions`);
        setPromotions(promotionsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (modalIsOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [modalIsOpen, timer]);

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePromotionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setSelectedChannel(null);
    setUserInputs({}); // Reset user inputs
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmountSelect = (value) => {
    setAmount(value);
  };

  const handleInputChange = (name, value) => {
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name, file) => {
    setUserInputs((prev) => ({ ...prev, [name]: file }));
  };

  const openModal = () => {
    if (selectedPaymentMethod && selectedChannel && amount && parseFloat(amount) >= 200) {
      setModalIsOpen(true);
      setTimer(1200);
    } else {
      alert("Please select a payment method, channel, and enter an amount of at least 200.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTimer(1200);
    setUserInputs({});
  };

const handleSubmit = async () => {
  try {
    // Step 1: Validate required inputs
    const requiredInputs = selectedPaymentMethod.userInputs.filter(
      (input) => input.isRequired === "true"
    );
    const missingInputs = requiredInputs.filter(
      (input) => !userInputs[input.name] || userInputs[input.name].toString().trim() === ""
    );

    if (missingInputs.length > 0) {
      const missingFields = missingInputs.map((input) => input.labelBD).join(", ");
   addToast(`Please fill in all required fields: ${missingFields}`, {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    // Step 2: Prepare userInputs
    const updatedUserInputs = { ...userInputs };
    for (const [name, value] of Object.entries(userInputs)) {
      const inputConfig = selectedPaymentMethod.userInputs.find((input) => input.name === name);
      if (!inputConfig) continue;

      if (value instanceof File) {
        // Handle file upload
        const fileFormData = new FormData();
        fileFormData.append("image", value);
        const uploadResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/upload`, {
          method: "POST",
          body: fileFormData,
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Failed to upload file");
        }
        updatedUserInputs[name] = {
          level: "user",
          type: inputConfig.type,
          data: uploadResult.filePath,
        };
      } else {
        // Handle text/number inputs
        updatedUserInputs[name] = {
          level: inputConfig.labelBD.toLowerCase().replace(/\s+/g, "_"), // যেমন, "Phone Number" -> "phone_number"
          type: inputConfig.type,
          data: value,
        };
      }
    }

    // Step 3: Create FormData for transaction
    const formData = new FormData();
    formData.append("userId", user?._id);
    formData.append("paymentMethodId", selectedPaymentMethod._id);
    formData.append("amount", amount);
    if (selectedOption) {
      const selectedPromo = promotions.find((promo) => promo.title_bd === selectedOption);
      formData.append("promotionId", selectedPromo._id);
    }

    // Append userInputs dynamically
    for (const [name, value] of Object.entries(updatedUserInputs)) {
      formData.append(`userInputs[${name}]`, JSON.stringify(value));
    }

    // Debug: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Step 4: Send request to backend
    const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/depositTransactions/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?._id,
        paymentMethodId: selectedPaymentMethod._id,
        amount,
        promotionId: selectedOption ? promotions.find((promo) => promo.title_bd === selectedOption)?._id : null,
        userInputs: updatedUserInputs,
        gateways: selectedChannel,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      addToast(`Failed to create deposit transaction: ${result.error || "Unknown error"}`, {
        appearance: "error",
        autoDismiss: true,
      });
     
    }
    addToast("Deposit transaction created successfully!", {
      appearance: "success",
      autoDismiss: true,
    });

   
    closeModal();
  } catch (error) {
    console.error("Error creating deposit transaction:", error);
 addToast(`Failed to create deposit transaction: ${error.message}`, {
      appearance: "error",
      autoDismiss: true,
    });
  }
};

  // Get bonus label for a payment method based on selected promotion
  const getBonusLabel = (methodId) => {
    if (!selectedOption) return null;
    const selectedPromo = promotions.find((promo) => promo.title_bd === selectedOption);
    if (!selectedPromo) return null;

    const bonus = selectedPromo.promotion_bonuses.find(
      (b) => b.payment_method._id.toString() === methodId.toString()
    );
    if (!bonus) return null;

    return bonus.bonus_type === "Fix" ? `+${bonus.bonus}TK` : `+${bonus.bonus}%`;
  };

  // Filter payment methods based on selected promotion
  const filteredPaymentMethods = selectedOption
    ? paymentMethods.filter((method) => {
        const selectedPromo = promotions.find((promo) => promo.title_bd === selectedOption);
        return selectedPromo?.promotion_bonuses.some(
          (bonus) => bonus.payment_method._id.toString() === method._id.toString()
        );
      })
    : paymentMethods;

  // Get gateways for the selected payment method
  const gateways = selectedPaymentMethod ? selectedPaymentMethod.gateway : [];

  // Check if the deposit button should be enabled
  const isDepositButtonEnabled =
    selectedPaymentMethod && selectedChannel && amount && parseFloat(amount) >= 200;

  return (
    <div className="flex gap-4">
      <div className="w-full p-3 sm:p-4 lg:p-6 bg-white rounded-lg space-y-4">
        <h1 className="text-lg font-semibold hidden md:block">আমানত</h1>
        <div className="grid grid-cols-2 bg-gray-700 rounded-t-xl md:hidden">
          <Link to={"/profile/deposit"}>
            <div className="w-full p-2 text-yellow-300 text-center border-b-4 border-yellow-400">
              আমানত
            </div>
          </Link>
          <Link to={"/profile/withdrawal"}>
            <div className="w-full p-2 text-yellow-300 text-center">উত্তোলন</div>
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-base">
            আমানত বিকল্প <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-4">
            {filteredPaymentMethods.map((method) => (
              <button
                key={method._id}
                onClick={() => handlePaymentMethodSelect(method)}
                className="relative"
              >
                <div
                  className={`p-4 w-full sm:w-24 h-16 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-2xl border-2 ${
                    selectedPaymentMethod?._id === method._id
                      ? "border-yellow-400"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_API_URL}${method.methodImage}`}
                    alt={method.methodNameBD}
                    className="w-full h-auto"
                    style={{ objectFit: "contain",    width: "60px" }}
                  />
                </div>
                {getBonusLabel(method._id) && (
                  <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                    {getBonusLabel(method._id)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-base">
            আমানত চ্যানেল <span className="text-red-500">*</span>
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {gateways.map((gateway, index) => (
              <button
                key={index}
                onClick={() => handleChannelSelect(gateway)}
                className={selectedPaymentMethod ? "" : "pointer-events-none opacity-50"}
              >
                <div
                  className={`py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg border-2 ${
                    selectedChannel === gateway ? "border-yellow-400" : "border-gray-400"
                  }`}
                >
                  {gateway}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-between w-full sm:w-80">
            <h2 className="text-base">
              আমানত পরিমাণ <span className="text-red-500">*</span>
            </h2>
            <FaQuestionCircle />
          </div>
          <form>
            <input
              type="text"
              className="w-full sm:w-80 py-1.5 px-4 border-2 border-gray-300 outline-none rounded-xl"
              placeholder="200"
              value={amount}
              onChange={handleAmountChange}
              disabled={!selectedChannel}
            />
          </form>
        {
          
        // <p className="text-xs font-mibold">
        //   ৳ 400.00 এর নিচে ডিপজিটে কোন বোনাস পাবেন না
        // </p>
        
        }
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {["200", "500", "2000", "5000", "10000", "20000"].map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmountSelect(value)}
                className={selectedChannel ? "" : "pointer-events-none opacity-50"}
              >
                <div className="relative">
                  <div
                    className={`py-1.5 px-4 flex items-center justify-center hover:bg-slate-200 duration-300 rounded-lg ${
                      amount === value ? "border-2 border-yellow-400" : "bg-gray-200"
                    }`}
                  >
                    {value}
                  </div>
                 
                </div>
              </button>
            ))}
          </div>
          <h2 className="text-base">
            আমানত বোনাস <span className="text-red-500">*</span>
          </h2>
          <div className="space-y-4 w-full sm:w-80">
            <select
              id="options"
              value={selectedOption}
              onChange={handlePromotionChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">নো বোনাস সিলেক্ট করুন</option>
              {promotions.map((promo) => (
                <option key={promo._id} value={promo.title_bd}>
                  {promo.title_bd}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={openModal}
            className={`py-3 px-10 w-full sm:w-80 text-sm text-white rounded-full border duration-300 ${
              isDepositButtonEnabled
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isDepositButtonEnabled}
          >
            আমানত
          </button>
        </div>
      </div>
      <RightItem />

      {/* Modal */}
      {modalIsOpen && selectedPaymentMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
          <div
            className="p-6 md:p-8 rounded-2xl shadow-2xl w-[95%] md:w-[85%] lg:w-[70%] max-h-[90vh] overflow-y-auto transform transition-transform duration-300 scale-100 hover:scale-100"
            style={{ backgroundColor: selectedPaymentMethod.backgroundColor }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side: Agent Info and User Inputs */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="border-b-2 border-gray-200 pb-4">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">
                    {selectedPaymentMethod.agentWalletText}
                  </p>
                  <p className="text-3xl md:text-4xl text-red-500 font-bold mt-2">
                    {selectedPaymentMethod.agentWalletNumber}
                  </p>
                </div>
                <p className="text-lg md:text-xl">
                  Amount: <span className="text-red-500 font-bold">{amount || "2000.00"}</span>
                </p>
                <div className="space-y-4">
                  {selectedPaymentMethod.userInputs.map((input, index) => (
                    <div key={index} className="flex flex-col">
                      <label
                        htmlFor={input.name}
                        className="text-lg text-red-500 font-medium mb-2"
                      >
                        {input.labelBD} {input.isRequired === "true" && <span className="text-red-500">*</span>}
                      </label>
                      {input.type === "file" ? (
                        <input
                          type="file"
                          id={input.name}
                          className="w-full py-2 px-3 bg-white rounded-lg border border-gray-300 text-gray-700"
                          onChange={(e) => handleFileChange(input.name, e.target.files[0])}
                        />
                      ) : (
                        <input
                          type={input.type}
                          id={input.name}
                          name={input.name}
                          className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                          placeholder={input.fieldInstructionBD}
                          required={input.isRequired === "true"}
                          value={userInputs[input.name] || ""}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full sm:w-64 mt-6">
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 text-lg font-semibold rounded-lg shadow-md hover:brightness-110 transition-all duration-200"
                    style={{
                      backgroundColor: selectedPaymentMethod.buttonColor,
                      color: selectedPaymentMethod.color,
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Right Side: Timer and Payment Page Image */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="text-center bg-gray-100 rounded-lg py-4 shadow-inner">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">Time Remaining</p>
                  <p className="text-4xl md:text-5xl text-red-500 font-bold mt-2">{formatTimer(timer)}</p>
                </div>
                <img
                  className="w-full h-48 md:h-64 object-contain rounded-lg "
                  src={`${import.meta.env.VITE_BASE_API_URL}${selectedPaymentMethod.paymentPageImage}`}
                  alt={selectedPaymentMethod.methodNameBD}
                />
              </div>
            </div>

            <div className="mt-6 text-base md:text-lg text-gray-600 text-center">
              <p>
               {
                <div dangerouslySetInnerHTML={{ __html: selectedPaymentMethod?.instructionBD }} />
               }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;



//***
// 
// 
//  {parseInt(value) >= 500 && selectedOption && (
                  //   <div className="p-1 absolute -top-1 -right-1 flex justify-center items-center text-[9px] text-white bg-blue-500 rounded-full">
                  //     {promotions
                  //       .find((promo) => promo.title_bd === selectedOption)
                  //       ?.promotion_bonuses.some((bonus) => bonus.bonus_type === "Percentage")
                  //       ? "+3%"
                  //       : "+3TK"}
                  //   </div>
                  // )}
// 
// /