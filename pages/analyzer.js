import { useState } from 'react';

export default function Analyzer() {
  const [businessData, setBusinessData] = useState({
    revenue: '',
    profit: '',
    askingPrice: '',
    ownerSalary: '',
    notes: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setBusinessData({ ...businessData, [field]: value });
  };

  const evaluateBusiness = () => {
    const rev = parseFloat(businessData.revenue);
    const prof = parseFloat(businessData.profit);
    const price = parseFloat(businessData.askingPrice);
    const sde = prof + parseFloat(businessData.ownerSalary);
    const roi = sde / price;
    const payback = price / sde;

    let recommendation = "Wait";
    if (roi > 0.4) recommendation = "Strong Buy";
    else if (roi > 0.25) recommendation = "Buy";
    else if (roi < 0.15) recommendation = "Run";

    setResult({ roi, payback, recommendation, sde });
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Business Deal Analyzer</h2>

      <input
        type="number"
        placeholder="Annual Revenue ($)"
        className="w-full p-2 border rounded"
        onChange={(e) => handleChange('revenue', e.target.value)}
      />
      <input
        type="number"
        placeholder="Net Profit ($)"
        className="w-full p-2 border rounded"
        onChange={(e) => handleChange('profit', e.target.value)}
      />
      <input
        type="number"
        placeholder="Asking Price ($)"
        className="w-full p-2 border rounded"
        onChange={(e) => handleChange('askingPrice', e.target.value)}
      />
      <input
        type="number"
        placeholder="Owner Salary Added Back ($)"
        className="w-full p-2 border rounded"
        onChange={(e) => handleChange('ownerSalary', e.target.value)}
      />
      <textarea
        placeholder="Notes / Deal Details"
        className="w-full p-2 border rounded"
        onChange={(e) => handleChange('notes', e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={evaluateBusiness}
      >
        Evaluate
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg text-gray-700 space-y-2">
          <p><strong>ROI:</strong> {(result.roi * 100).toFixed(1)}%</p>
          <p><strong>Payback Period:</strong> {result.payback.toFixed(1)} years</p>
          <p><strong>SDE:</strong> ${result.sde.toLocaleString()}</p>
          <p><strong>Recommendation:</strong> {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}
