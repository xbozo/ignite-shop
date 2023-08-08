import { AppProps } from "next/app";

import { globalStyles } from "@/styles/global";
import * as C from "@/styles/pages/app";
import Image from "next/image";
import logoImg from '../assets/logo.svg';

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <C.Container>
      <C.Header>
        <Image 
          src={logoImg.src} 
          width={logoImg.width} 
          height={logoImg.height} 
          alt="" 
        />
      </C.Header>

      <Component {...pageProps} />
    </C.Container>
  )
}
