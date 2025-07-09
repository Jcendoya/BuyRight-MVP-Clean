import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

      <Input placeholder="Annual Revenue ($)" onChange={(e) => handleChange('revenue', e.target.value)} />
      <Input placeholder="Net Profit ($)" onChange={(e) => handleChange('profit', e.target.value)} />
      <Input placeholder="Asking Price ($)" onChange={(e) => handleChange('askingPrice', e.target.value)} />
      <Input placeholder="Owner Salary Added Back ($)" onChange={(e) => handleChange('ownerSalary', e.target.value)} />
      <Textarea placeholder="Notes / Deal Details" onChange={(e) => handleChange('notes', e.target.value)} />
      <Button onClick={evaluateBusiness}>Evaluate</Button>

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
