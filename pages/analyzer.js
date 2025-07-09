// Business Buy Analyzer MVP – With Landing Page + Deal Flow

import { useState } from 'react';
import jsPDF from 'jspdf';

export default function BusinessBuyAnalyzer() {
  const [step, setStep] = useState('landing');
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
        "❌ Keep looking — the right one is out there."
      ];
    }
  };

  if (step === 'landing') {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">Know if it’s a good business deal — in 60 seconds.</h1>
        <p className="text-lg text-gray-600">We help you instantly evaluate any service business. No spreadsheets. No stress. Just clarity.</p>
        <Button onClick={() => setStep('form')}>Evaluate a Deal</Button>
        <div className="mt-10 text-left space-y-4">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Enter basic info: Revenue, profit, asking price, and owner salary.</li>
            <li>Get ROI, payback time, and a recommendation.</li>
            <li>Download your custom game plan with next steps.</li>
          </ol>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">Business Deal Evaluator</h2>
            <Input placeholder="Annual Revenue ($)" onChange={(e) => handleChange('revenue', e.target.value)} />
            <Input placeholder="Net Profit ($)" onChange={(e) => handleChange('profit', e.target.value)} />
            <Input placeholder="Asking Price ($)" onChange={(e) => handleChange('askingPrice', e.target.value)} />
            <Input placeholder="Owner Salary Added Back ($)" onChange={(e) => handleChange('ownerSalary', e.target.value)} />
            <Textarea placeholder="Notes / Deal Details" onChange={(e) => handleChange('notes', e.target.value)} />
            <Button onClick={evaluateBusiness}>Evaluate</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'result' && result) {
    const { roi, payback, recommendation, sde } = result;
    const score = (roi * 100).toFixed(1);
    const pay = payback.toFixed(1);

    let tone = "";

    if (recommendation === "Strong Buy" || recommendation === "Buy") {
      tone = `This is a strong opportunity. The asking price aligns well with its earnings. With an ROI of ${score}%, you're looking at a quick payback and a solid foundation to build from.`;
    } else if (recommendation === "Wait") {
      tone = `The numbers aren’t bad, but this might need negotiation or more clarity before moving forward. ROI is ${score}% and payback is ${pay} years.`;
    } else {
      tone = `With a low ROI and long payback timeline, this deal likely isn’t worth the risk — at least not at the current price.`;
    }

    return (
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Your Deal Analysis</h2>
        <p><strong>ROI:</strong> {score}%</p>
        <p><strong>Payback Period:</strong> {pay} years</p>
        <p><strong>SDE:</strong> ${sde.toLocaleString()}</p>
        <p><strong>Recommendation:</strong> {recommendation}</p>

        <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
          <p className="font-semibold mb-2">What this means:</p>
          <p>{tone}</p>
        </div>

        <div className="bg-white p-4 shadow-sm rounded-lg">
          <p className="font-semibold mb-2">Here’s what to do next:</p>
          <ul className="list-disc list-inside space-y-1">
            {getSteps(recommendation).map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>

        <Button onClick={downloadPDF}>Download Summary (PDF)</Button>
        <Button onClick={() => setStep('form')}>Evaluate Another Deal</Button>
      </div>
    );
  }

  return null;
}

