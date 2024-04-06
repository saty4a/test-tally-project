"use client"

import { Layout } from "@/components/layout/layout";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types"
import React from "react"

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps ) {
    return(
        <NextUIProvider>
            <ThemeProvider defaultTheme="system" attribute="class" {...themeProps}>
                <Layout>
                    {children}
                </Layout>
            </ThemeProvider>
        </NextUIProvider>
    )
}