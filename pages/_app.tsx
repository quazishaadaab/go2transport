import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import {useRouter} from 'next/router';
import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

	return (
		<NextUIProvider locale="en-CA" navigate={router.push}>
			<Toaster/>

			{/* <NextThemesProvider> this makes it black */}
				<Component {...pageProps} />
			{/* </NextThemesProvider> */}
		</NextUIProvider>
	);
}

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};
