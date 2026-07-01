import React from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
  }
  .loader {
    --color-one: #4285F4;
    --color-two: #E81CFF;
    --color-three: #4285F480;
    --color-four: #E81CFF80;
    --color-five: #4285F440;
    --time-animation: 2s;
    --size: 1.2;
    position: relative;
    border-radius: 50%;
    transform: scale(var(--size));
    box-shadow:
      0 0 25px 0 var(--color-three),
      0 20px 50px 0 var(--color-four);
    animation: colorize calc(var(--time-animation) * 3) ease-in-out infinite;
  }

  .loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border-top: solid 1px var(--color-one);
    border-bottom: solid 1px var(--color-two);
    background: linear-gradient(180deg, var(--color-five), var(--color-four));
    box-shadow:
      inset 0 10px 10px 0 var(--color-three),
      inset 0 -10px 10px 0 var(--color-four);
  }

  .loader .box {
    width: 100px;
    height: 100px;
    background: linear-gradient(
      180deg,
      var(--color-one) 30%,
      var(--color-two) 70%
    );
    mask: url(#clipping);
    -webkit-mask: url(#clipping);
  }

  .loader svg {
    position: absolute;
  }

  .loader svg #clipping {
    filter: contrast(15);
    animation: roundness calc(var(--time-animation) / 2) linear infinite;
  }

  .loader svg #clipping polygon {
    filter: blur(7px);
  }

  .loader svg #clipping polygon:nth-child(1) {
    transform-origin: 75% 25%;
    transform: rotate(90deg);
  }

  .loader svg #clipping polygon:nth-child(2) {
    transform-origin: 50% 50%;
    animation: rotation var(--time-animation) linear infinite reverse;
  }

  .loader svg #clipping polygon:nth-child(3) {
    transform-origin: 50% 60%;
    animation: rotation var(--time-animation) linear infinite;
    animation-delay: calc(var(--time-animation) / -3);
  }

  .loader svg #clipping polygon:nth-child(4) {
    transform-origin: 40% 40%;
    animation: rotation var(--time-animation) linear infinite reverse;
  }

  .loader svg #clipping polygon:nth-child(5) {
    transform-origin: 40% 40%;
    animation: rotation var(--time-animation) linear infinite reverse;
    animation-delay: calc(var(--time-animation) / -2);
  }

  .loader svg #clipping polygon:nth-child(6) {
    transform-origin: 60% 40%;
    animation: rotation var(--time-animation) linear infinite;
  }

  .loader svg #clipping polygon:nth-child(7) {
    transform-origin: 60% 40%;
    animation: rotation var(--time-animation) linear infinite;
    animation-delay: calc(var(--time-animation) / -1.5);
  }

  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes roundness {
    0% { filter: contrast(15); }
    20% { filter: contrast(3); }
    40% { filter: contrast(3); }
    60% { filter: contrast(15); }
    100% { filter: contrast(15); }
  }

  @keyframes colorize {
    0% { filter: hue-rotate(0deg); }
    20% { filter: hue-rotate(-30deg); }
    40% { filter: hue-rotate(-60deg); }
    60% { filter: hue-rotate(-90deg); }
    80% { filter: hue-rotate(-45deg); }
    100% { filter: hue-rotate(0deg); }
  }
</style>
</head>
<body>
  <div class="loader">
    <svg width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <mask id="clipping">
          <polygon points="0,0 100,0 100,100 0,100" fill="black" />
          <polygon points="25,25 75,25 50,75" fill="white" />
          <polygon points="50,25 75,75 25,75" fill="white" />
          <polygon points="35,35 65,35 50,65" fill="white" />
          <polygon points="35,35 65,35 50,65" fill="white" />
          <polygon points="35,35 65,35 50,65" fill="white" />
          <polygon points="35,35 65,35 50,65" fill="white" />
        </mask>
      </defs>
    </svg>
    <div class="box"></div>
  </div>
</body>
</html>
`;

const Div = 'div' as any;
const Svg = 'svg' as any;
const Defs = 'defs' as any;
const Mask = 'mask' as any;
const Polygon = 'polygon' as any;
const Style = 'style' as any;

export const AILoader = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ width: 180, height: 180, justifyContent: 'center', alignItems: 'center' }}>
        <Style>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
          .custom-loader {
            --color-one: #4285F4;
            --color-two: #E81CFF;
            --color-three: #4285F480;
            --color-four: #E81CFF80;
            --color-five: #4285F440;
            --time-animation: 2s;
            --size: 1.2;
            position: relative;
            border-radius: 50%;
            transform: scale(var(--size));
            box-shadow:
              0 0 25px 0 var(--color-three),
              0 20px 50px 0 var(--color-four);
            animation: colorize calc(var(--time-animation) * 3) ease-in-out infinite;
          }
          .custom-loader::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border-top: solid 1px var(--color-one);
            border-bottom: solid 1px var(--color-two);
            background: linear-gradient(180deg, var(--color-five), var(--color-four));
            box-shadow:
              inset 0 10px 10px 0 var(--color-three),
              inset 0 -10px 10px 0 var(--color-four);
          }
          .custom-loader .box {
            width: 100px;
            height: 100px;
            background: linear-gradient(
              180deg,
              var(--color-one) 30%,
              var(--color-two) 70%
            );
            mask: url(#clipping-web);
            -webkit-mask: url(#clipping-web);
          }
          .custom-loader svg {
            position: absolute;
          }
          .custom-loader svg #clipping-web {
            filter: contrast(15);
            animation: roundness calc(var(--time-animation) / 2) linear infinite;
          }
          .custom-loader svg #clipping-web polygon {
            filter: blur(7px);
          }
          .custom-loader svg #clipping-web polygon:nth-child(1) {
            transform-origin: 75% 25%;
            transform: rotate(90deg);
          }
          .custom-loader svg #clipping-web polygon:nth-child(2) {
            transform-origin: 50% 50%;
            animation: rotation var(--time-animation) linear infinite reverse;
          }
          .custom-loader svg #clipping-web polygon:nth-child(3) {
            transform-origin: 50% 60%;
            animation: rotation var(--time-animation) linear infinite;
            animation-delay: calc(var(--time-animation) / -3);
          }
          .custom-loader svg #clipping-web polygon:nth-child(4) {
            transform-origin: 40% 40%;
            animation: rotation var(--time-animation) linear infinite reverse;
          }
          .custom-loader svg #clipping-web polygon:nth-child(5) {
            transform-origin: 40% 40%;
            animation: rotation var(--time-animation) linear infinite reverse;
            animation-delay: calc(var(--time-animation) / -2);
          }
          .custom-loader svg #clipping-web polygon:nth-child(6) {
            transform-origin: 60% 40%;
            animation: rotation var(--time-animation) linear infinite;
          }
          .custom-loader svg #clipping-web polygon:nth-child(7) {
            transform-origin: 60% 40%;
            animation: rotation var(--time-animation) linear infinite;
            animation-delay: calc(var(--time-animation) / -1.5);
          }
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes roundness {
            0% { filter: contrast(15); }
            20% { filter: contrast(3); }
            40% { filter: contrast(3); }
            60% { filter: contrast(15); }
            100% { filter: contrast(15); }
          }
          @keyframes colorize {
            0% { filter: hue-rotate(0deg); }
            20% { filter: hue-rotate(-30deg); }
            40% { filter: hue-rotate(-60deg); }
            60% { filter: hue-rotate(-90deg); }
            80% { filter: hue-rotate(-45deg); }
            100% { filter: hue-rotate(0deg); }
          }
        `}</Style>
        <Div className="loader-container">
          <Div className="custom-loader">
            <Svg width={100} height={100} viewBox="0 0 100 100">
              <Defs>
                <Mask id="clipping-web">
                  <Polygon points="0,0 100,0 100,100 0,100" fill="black" />
                  <Polygon points="25,25 75,25 50,75" fill="white" />
                  <Polygon points="50,25 75,75 25,75" fill="white" />
                  <Polygon points="35,35 65,35 50,65" fill="white" />
                  <Polygon points="35,35 65,35 50,65" fill="white" />
                  <Polygon points="35,35 65,35 50,65" fill="white" />
                  <Polygon points="35,35 65,35 50,65" fill="white" />
                </Mask>
              </Defs>
            </Svg>
            <Div className="box" />
          </Div>
        </Div>
      </View>
    );
  }

  return (
    <View style={{ width: 180, height: 180, justifyContent: 'center', alignItems: 'center' }}>
      <WebView
        source={{ html: htmlContent }}
        style={{ width: 180, height: 180, backgroundColor: 'transparent' }}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        originWhitelist={['*']}
      />
    </View>
  );
};
