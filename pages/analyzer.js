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

  const getTone = (roi, payback, recommendation) => {
    if (recommendation === "Strong Buy" || recommendation === "Buy") {
      return `With a ${recommendation} rating, this business appears to be a great opportunity. ROI is ${(roi * 100).toFixed(1)}% with a payback in ${payback.toFixed(1)} years. Strong upside potential.`;
    } else if (recommendation === "Wait") {
      return `This deal might be worth exploring further, but it’s not an obvious win. ROI is ${(roi * 100).toFixed(1)}%. Make sure the financials are real and look for negotiation room.`;
    } else {
      return `This deal looks risky. ROI is only ${(roi * 100).toFixed(1)}% with a long payback. Avoid unless pricing or earnings change drastically.`;
    }
  };

  const getSteps = (recommendation) => {
    if (recommendation === "Strong Buy" || recommendation === "Buy") {
      return [
        "✅ Ask the seller for 3 years of P&Ls and tax returns.",
        "✅ Understand how involved the current owner is day-to-day.",
        "✅ Explore SBA loans, seller financing, or partner capital.",
        "✅ Build a 12-month growth/ops plan — how will YOU improve this?",
        "✅ Put together a summary to pitch to lenders or partners."
      ];
    } else if (recommendation === "Wait") {
      return [
        "⚠️ Review the profit + salary details — is it padded?",
        "⚠️ Ask if the seller will budge on price or financing.",
        "⚠️ Consider why they’re selling and how competitive the market is.",
        "⚠️ Look at comps — can this business grow or just survive?"
      ];
    } else {
      return [
        "❌ Low earnings relative to price — bad ROI.",
        "❌ Not ideal unless price is deeply reduced.",
        "❌ Keep looking — the right one is out there.",
      ];
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Business Deal Analyzer</h2>

      <input type="number" placeholder="Annual Revenue ($)" className="w-full p-2 border rounded"
        onChange={(e) => handleChange('revenue', e.target.value)} />
      <input type="number" placeholder="Net Profit ($)" className="w-full p-2 border rounded"
        onChange={(e) => handleChange('profit', e.target.value)} />
      <input type="number" placeholder="Asking Price ($)" className="w-full p-2 border rounded"
        onChange={(e) => handleChange('askingPrice', e.target.value)} />
      <input type="number" placeholder="Owner Salary Added Back ($)" className="w-full p-2 border rounded"
        onChange={(e) => handleChange('ownerSalary', e.target.value)} />
      <textarea placeholder="Notes / Deal Details" className="w-full p-2 border rounded"
        onChange={(e) => handleChange('notes', e.target.value)} />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={evaluateBusiness}>
        Evaluate
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded-lg text-gray-700 space-y-4 mt-6">
          <p><strong>ROI:</strong> {(result.roi * 100).toFixed(1)}%</p>
          <p><strong>Payback Period:</strong> {result.payback.toFixed(1)} years</p>
          <p><strong>SDE:</strong> ${result.sde.toLocaleString()}</p>
          <p><strong>Recommendation:</strong> {result.recommendation}</p>

          <div className="p-3 bg-white border rounded shadow-sm">
            <p className="font-semibold mb-2">What this means:</p>
            <p>{getTone(result.roi, result.payback, result.recommendation)}</p>
          </div>

          <div className="p-3 bg-white border rounded shadow-sm">
            <p className="font-semibold mb-2">Next Steps:</p>
            <ul className="list-disc list-inside space-y-1">
              {getSteps(result.recommendation).map((step, i) => <li key={i}>{step}</li>)}
                                                   import jsPDF from "jspdf";

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

            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
