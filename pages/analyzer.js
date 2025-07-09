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
        onChange={(e) => handleChange('r
