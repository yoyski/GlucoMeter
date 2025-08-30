import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [step, setStep] = useState(1);
  const [testType, setTestType] = useState("");
  const [data, setData] = useState({
    level: 0,
    unit: "",
  });
  const [dataList, setDataList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:3000/GlucoMeter");
    setDataList(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addRecord = async () => {
    const category = getCategory(testType, data);

    const res = await axios.post("http://localhost:3000/GlucoMeter", {
      date: new Date().toLocaleDateString(),
      result: `${testType}: ${data.level} ${data.unit} - ${category}`,
    });

    setDataList([...dataList, res.data]);
    console.log(res.data);
  };

  function dataRecords() {
    return (
      <div className="max-w-md mx-auto mt-8 p-1 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md 
             hover:bg-blue-600 active:scale-95 transition-all duration-200"
          >
            {isOpen ? "Hide Result" : "Show Result"}
          </button>
        </h2>
        {isOpen &&
          (dataList.length === 0 ? (
            <p className="text-gray-500 text-center">No records found.</p>
          ) : (
            <ul className="space-y-3">
              {dataList.map((data) => (
                <li
                  key={data._id}
                  className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-700 font-medium">{data.date}</span>
                  <span className="block mt-1 text-gray-600 text-sm">
                    {data.result}
                  </span>
                </li>
              ))}
            </ul>
          ))}
      </div>
    );
  }

  const classifications = [
    {
      category: "Hypoglycemia (Low)",
      message:
        "Your blood sugar level is low. Consider consuming fast-acting carbohydrates like fruit juice or glucose tablets to raise your blood sugar levels quickly.",
      colorCard: "from-blue-400 to-blue-600",
      colorCategory: "bg-blue-200 text-blue-900",
    },
    {
      category: "Normal",
      message:
        "Your blood sugar level is within the normal range. Maintain a balanced diet and regular exercise to keep your levels stable.",
      colorCard: "from-green-400 to-green-600",
      colorCategory: "bg-green-200 text-green-900",
    },
    {
      category: "Prediabetes",
      message:
        "Your blood sugar level indicates prediabetes. It's important to monitor your diet, increase physical activity, and consult with a healthcare provider for further evaluation.",
      colorCard: "from-yellow-300 to-yellow-500",
      colorCategory: "bg-yellow-200 text-yellow-900",
    },
    {
      category: "Diabetes",
      message:
        "Your blood sugar level is high and indicates diabetes. Please consult with a healthcare provider for a comprehensive evaluation and management plan.",
      colorCard: "from-rose-600 to-rose-800",
      colorCategory: "bg-rose-200 text-rose-900",
    },
    {
      category: "Hyperglycemia (Very High)",
      message:
        "Your blood sugar level is very high. Seek immediate medical attention to prevent complications.",
      colorCard: "from-red-500 to-red-700",
      colorCategory: "bg-red-200 text-red-900",
    },
  ];

  function conversion(unit, level) {
    const conversionRates =
      unit === "mg/dL"
        ? (level / 18).toFixed(1) + " mmol/L"
        : (level * 18).toFixed(1) + " mg/dL";

    return (
      <div>
        {level} {unit} - {conversionRates}
      </div>
    );
  }

  function resultBox(
    unit,
    level,
    { category, message, colorCard, colorCategory }
  ) {
    return (
      <div
        className={`bg-gradient-to-br ${colorCard} text-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto transition transform hover:scale-[1.02] hover:shadow-2xl`}
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium tracking-wide uppercase opacity-80">
            {testType}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${colorCategory}`}
          >
            {conversion(unit, level)}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-2">{category}</h2>

        <p className="text-sm leading-relaxed opacity-90">{message}</p>
      </div>
    );
  }
  function getCategory(testType, { unit, level }) {
    const newLevel = unit === "mg/dL" ? level : level * 18;

    if (testType === "Random Blood Sugar") {
      if (newLevel < 90) return "Hypoglycemia (Low)";
      if (newLevel < 140) return "Normal";
      if (newLevel < 180) return "Prediabetes";
      if (newLevel < 250) return "Diabetes";
      return "Hyperglycemia (Very High)";
    }

    if (testType === "Fasting Blood Sugar") {
      if (newLevel < 70) return "Hypoglycemia (Low)";
      if (newLevel < 100) return "Normal";
      if (newLevel < 126) return "Prediabetes";
      if (newLevel < 200) return "Diabetes";
      return "Hyperglycemia (Very High)";
    }

    return "Unknown";
  }

  function randomBloodSugar({ unit, level }) {
    const category = getCategory("Random Blood Sugar", { unit, level });
    return resultBox(
      unit,
      level,
      classifications.find((c) => c.category === category)
    );
  }

  function fastingBloodSugar({ unit, level }) {
    const category = getCategory("Fasting Blood Sugar", { unit, level });
    return resultBox(
      unit,
      level,
      classifications.find((c) => c.category === category)
    );
  }

  return (
    <>
      <div className="max-w-md mx-auto mt-10 bg-blue-600 p-6 rounded-2xl shadow-2xl text-white">
        <h1 className="text-2xl font-bold mb-4">GlucoMeter</h1>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <button
              className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition"
              onClick={() => {
                setTestType("Fasting Blood Sugar");
                setStep(2);
              }}
            >
              Fasting Blood Sugar
            </button>
            <button
              className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition"
              onClick={() => {
                setTestType("Random Blood Sugar");
                setStep(2);
              }}
            >
              Random Blood Sugar
            </button>
            {dataRecords()}
          </div>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
          >
            <div className="flex flex-col gap-4">
              <input
                required
                type="number"
                placeholder={`Enter your ${testType}`}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    level: Number(e.target.value),
                  }))
                }
                className="p-3 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <select
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="p-3 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">-- Select Unit --</option>
                <option value="mg/dL">mg/dL</option>
                <option value="mmol/L">mmol/L</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg transition"
                  onClick={() => setStep(1)}
                >
                  Prev
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg transition"
                >
                  Show Result
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            {testType === "Random Blood Sugar" && randomBloodSugar(data)}
            {testType === "Fasting Blood Sugar" && fastingBloodSugar(data)}
            <div className="flex justify-between">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg transition"
                onClick={() => setStep(2)}
              >
                Prev
              </button>
              <button
                className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition"
                onClick={() => {
                  addRecord();
                  setStep(1);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
