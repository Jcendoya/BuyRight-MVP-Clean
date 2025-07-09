import { useState } from 'react';
import jsPDF from 'jspdf';

export default function Analyzer() {
  const [step, setStep] = useState('form');
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
    const rev = parseFloat(businessData.revenue || 0);
    const prof = parseFloat(businessData.profit || 0);
    const price = parseFloat(businessData.askingPrice || 1);
    const salary = parseFloat(businessData.ownerSalary || 0);
    const sde = prof + salary;
    const roi = sde / price;
    const payback = price / sde;

    let recommendation = "Wait";
    if (roi > 0.4) recommendation = "Strong Buy";
    else if (roi > 0.25) recommendation = "Buy";
    else if (roi < 0.15) recommendation = "Run";

    setResult({ roi, payback, recommendation, sde });
    setStep('result');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Business Deal Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`ROI: ${(result.roi * 100).toFixed(1)}%`, 20, 35);
    doc.text(`Payback Period: ${result.payback.toFixed(1)} years`, 20, 45);
    doc.text(`SDE: $${result.sde.toLocaleString()}`, 20, 55);
    doc.text(`Recommendation: ${result.recommendation}`, 20, 65);

    const steps = getSteps(result.recommendation);
    doc.text("Next Steps:", 20, 80);
    steps.forEach((step, idx) => {
      doc.text(`• ${step.replace(/✅|⚠️|❌/g, '')}`, 25, 90 + idx * 10);
    });

    doc.save("deal-summary.pdf");
  };

  const getSteps = (recommendation) => {
    if (recommendation === "Strong Buy" || recommendation === "Buy") {
      return [
        "✅ Ask for 3 years of P&Ls and tax returns.",
        "✅ Confirm how involved the owner is daily.",
        "✅ Explore SBA loan or seller financing.",
        "✅ Create your 12-month growth plan.",
        "✅ Build pitch for investors or lenders."
      ];
    } else if (recommendation === "Wait") {
      return [
        "⚠️ Review profit + salary accuracy.",
        "⚠️ Try negotiating on price/terms.",
        "⚠️ Ask why they’re selling.",
        "⚠️ Check growth potential and local comps."
      ];
    } else {
      return [
        "❌ ROI too low for asking price.",
        "❌ Walk away unless price drops significantly.",
        "❌ Likely not worth your time."
      ];
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Business Deal Analyzer</h1>

      {step === 'form' && (
        <div className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Annual Revenue ($)"
            onChange={(e) => handleChange('revenue', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Net Profit ($)"
            onChange={(e) => handleChange('profit', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Asking Price ($)"
            onChange={(e) => handleChange('askingPrice', e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Owner Salary Add-Back ($)"
            onChange={(e) => handleChange('ownerSalary', e.target.value)}
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Notes / Deal Details"
            onChange={(e) => handleChange('notes', e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            onClick={evaluateBusiness}
          >
            Analyze Deal
          </button>
        </div>
      )}

      {step === 'result' && result && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Your Deal Summary</h2>
            <p><strong>ROI:</strong> {(result.roi * 100).toFixed(1)}%</p>
            <p><strong>Payback:</strong> {result.payback.toFixed(1)} years</p>
            <p><strong>SDE:</strong> ${result.sde.toLocaleString()}</p>
            <p><strong>Recommendation:</strong> {result.recommendation}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <ul className="list-disc list-inside space-y-1">
              {getSteps(result.recommendation).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <button
            className="w-full bg-green-600 text-white py-2 rounded"
            onClick={downloadPDF}
          >
            Download Summary (PDF)
          </button>

          <button
            className="w-full bg-gray-500 text-white py-2 rounded"
            onClick={() => setStep('form')}
          >
            Analyze Another Deal
          </button>
        </div>
      )}
    </div>
  );
}
