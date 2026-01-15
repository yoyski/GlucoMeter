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

  const API_URL = "https://glucometer.onrender.com";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/GlucoMeter`);
      setDataList(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addRecord = async () => {
    const category = getCategory(testType, data);

    try {
      const res = await axios.post(`${API_URL}/GlucoMeter`, {
        
          date: new Date().toLocaleDateString(),
          result: `${testType}: ${data.level} ${data.unit} - ${category}`,
      });
    
      setDataList([...dataList, res.data]);
      setStep(1);
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`${API_URL}/GlucoMeter/${id}`);
      setDataList(dataList.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  function dataRecords() {
    return (
      <div className="mt-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 px-4 bg-white/10 backdrop-blur-sm text-white rounded-xl 
          hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
        >
          {isOpen ? "Hide History" : "View History"}
        </button>

        {isOpen && (
          <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
            {dataList.length === 0 ? (
              <p className="text-white/70 text-center py-8">No records yet</p>
            ) : (
              dataList.map((data) => (
                <div
                  key={data._id}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 
                  hover:bg-white/15 transition-all group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-white/90 text-sm font-medium mb-1">
                        {data.date}
                      </p>
                      <p className="text-white/70 text-sm">{data.result}</p>
                    </div>
                    <button
                      className="px-3 py-1.5 text-xs rounded-lg bg-red-500/80 text-white 
                      hover:bg-red-500 transition opacity-0 group-hover:opacity-100"
                      onClick={() => deleteRecord(data._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  const classifications = [
    {
      category: "Hypoglycemia (Low)",
      message: "Your blood sugar is low. Consider consuming fast-acting carbohydrates.",
      gradient: "from-blue-500 to-cyan-500",
      icon: "⚠️",
    },
    {
      category: "Normal",
      message: "Your blood sugar is within normal range. Keep up the good work!",
      gradient: "from-green-500 to-emerald-500",
      icon: "✓",
    },
    {
      category: "Prediabetes",
      message: "Monitor your diet and increase physical activity. Consult your healthcare provider.",
      gradient: "from-yellow-500 to-amber-500",
      icon: "⚡",
    },
    {
      category: "Diabetes",
      message: "Consult with a healthcare provider for a comprehensive evaluation.",
      gradient: "from-orange-500 to-red-500",
      icon: "⚠️",
    },
    {
      category: "Hyperglycemia (Very High)",
      message: "Seek immediate medical attention to prevent complications.",
      gradient: "from-red-600 to-rose-700",
      icon: "🚨",
    },
  ];

  function conversion(unit, level) {
    const converted = unit === "mg/dL"
      ? (level / 18).toFixed(1) + " mmol/L"
      : (level * 18).toFixed(1) + " mg/dL";

    return `${level} ${unit} ≈ ${converted}`;
  }

  function resultBox(unit, level, { category, message, gradient, icon }) {
    return (
      <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/80 text-sm font-medium">{testType}</span>
          <span className="text-3xl">{icon}</span>
        </div>

        <h2 className="text-white text-3xl font-bold mb-2">{category}</h2>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 mb-4 inline-block">
          <p className="text-white text-sm font-mono">{conversion(unit, level)}</p>
        </div>

        <p className="text-white/90 text-sm leading-relaxed">{message}</p>
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
    return resultBox(unit, level, classifications.find((c) => c.category === category));
  }

  function fastingBloodSugar({ unit, level }) {
    const category = getCategory("Fasting Blood Sugar", { unit, level });
    return resultBox(unit, level, classifications.find((c) => c.category === category));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GlucoMeter</h1>
          <p className="text-white/60 text-sm">Track your blood sugar levels</p>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <button
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 
              hover:to-pink-600 text-white py-4 px-6 rounded-xl transition-all duration-200 
              font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              onClick={() => {
                setTestType("Fasting Blood Sugar");
                setStep(2);
              }}
            >
              Fasting Blood Sugar
            </button>
            <button
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 
              hover:to-teal-600 text-white py-4 px-6 rounded-xl transition-all duration-200 
              font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
            className="space-y-4"
          >
            <div>
              <label className="text-white/80 text-sm mb-2 block">Blood Sugar Level</label>
              <input
                required
                type="number"
                placeholder="Enter value"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, level: Number(e.target.value) }))
                }
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm mb-2 block">Unit</label>
              <select
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                transition"
              >
                <option value="" className="bg-slate-800">Select unit</option>
                <option value="mg/dL" className="bg-slate-800">mg/dL</option>
                <option value="mmol/L" className="bg-slate-800">mmol/L</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white 
                py-3 px-4 rounded-xl transition font-medium border border-white/20"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 
                hover:to-cyan-600 text-white py-3 px-4 rounded-xl transition font-medium shadow-lg"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {testType === "Random Blood Sugar" && randomBloodSugar(data)}
            {testType === "Fasting Blood Sugar" && fastingBloodSugar(data)}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white 
                py-3 px-4 rounded-xl transition font-medium border border-white/20"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 
                hover:to-emerald-600 text-white py-3 px-4 rounded-xl transition font-medium shadow-lg"
                onClick={() => addRecord()}
              >
                Save Record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;