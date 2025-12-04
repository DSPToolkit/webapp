"use client"; // This is a client component 👈🏽
import React from 'react';
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ZeroPole } from './components/AppFrame/ZeroPole/ZeroPole';
import { FIRFilterDesign } from './components/AppFrame/FIRFilterDesign/FIRFilterDesign';
import { IIRFilterDesign } from './components/AppFrame/IIRFilterDesign/IIRFilterDesign';
import { LeastSqaureLinearPhaseFIRDesign } from './components/AppFrame/LeastSquareLinearPhaseFIRDesign/LeastSqaureLinearPhaseFIRDesign';
import { Prompt } from './components/AppFrame/Prompt/Prompt';

export default function Home() {
  const items = [
    { placeholder: "Zero-pole placement", name: "zero_pole" },
    { placeholder: "Windowing method", name: "fir_filter_design" },
    { placeholder: "Analog-to-digital transform", name: "iir_filter_design" },
    { placeholder: "Linear phase FIR-LS", name: "least_square_linear_phase_FIR" },
    { placeholder: "> Interactive Prompt", name: "prompt" },
    { placeholder: "Help?", name: "help" }
  ];

  const [selectedItem, setSelectedItem] = React.useState(items[0]);

  const addComponent = () => {
    switch (selectedItem.name) {
      case "zero_pole":
        return <ZeroPole />;
      case "fir_filter_design":
        return <FIRFilterDesign />;
      case "iir_filter_design":
        return <IIRFilterDesign />;
        case "least_square_linear_phase_FIR":
        return <LeastSqaureLinearPhaseFIRDesign />;
      case "prompt":
        return <Prompt />;
      case "help":
        return (
          <div className="bg-white rounded-lg shadow w-full p-5">
            <br></br>
            <p>
              DSPToolkit is an opensource web app for designing and visualizing digital filters.
            </p>
            <p>
              Features include designing filters by placing <b>poles and zeroes on the Z-plane</b>, FIR filter design using windowing method, IIR design using Analog-to-digital transfomation, and lastly, applying least-squares solution.
            </p>
            <p>
              For additional information visit:
            </p>
            <br></br>
            <p><a className="text-blue-600" href="https://github.com/DSPToolkit/webapp">GitHub.com/DSPToolkit/webapp</a></p>
            <br></br>
            <p>Version: 0.2 </p>
          </div >
        )
    }
  }

  return (
    <main className="flex h-screen">
      <Sidebar items={items} selectedItem={selectedItem} updateSelectedItem={(e) => setSelectedItem((_) => e)} />
      {addComponent()}

    </main>

  )
}
