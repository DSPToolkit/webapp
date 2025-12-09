# ForgeDSP web app
A digital signal processing (DSP) application for designing filters, estimating power spectral density, generating waveforms, and more.

## Filter Design
The application supports designing digital filters using several methods:

- Visually placing poles and zeros on the Z-plane
- Windowing methods for FIR filter design
- Analog-to-digital IIR filter design using Butterworth and Chebyshev filters
- Weighted least-squares design of linear-phase FIR filters

After a filter is designed, the application:

- Computes and displays the magnitude and phase of the frequency response
- Generates the corresponding filter coefficients
- Simulates and visualizes the filter’s output on user-selected input signals

## Spectral Estimation

The application supports periodogram estimation. Users can:
- upload a signal from a file, or
- write expressions to generate signals directly.



## Getting Started
To use the app, simply visit [forgedsp.github.io/webapp](https://forgedsp.github.io/webapp).
Alternatively, to install and run the app locally, make sure you have a recent version of [Node](https://nodejs.org/en) installed.
Afterwards:

- Clone the repository:
```shell
git clone git@github.com:ForgeDSP/webapp.git
cd webapp
```
- Install the dependencies:
```shell
npm install
```
- Run the web app:
```shell
npm run dev
```
- The app should become accessible on 'http://localhost:3000' or on a similar port.

Screenshot:

![](https://raw.githubusercontent.com/ForgeDSP/ForgeDSP.github.io/refs/heads/main/screenshot.png)
<!-- ## Demo
The following video shows the design of a low-pass filter:
![](https://raw.githubusercontent.com/alavifazel/demo/refs/heads/main/animation-smaller.gif) -->

## License
The software is released under Apache License 2.0. View the LICENSE file for more info.
