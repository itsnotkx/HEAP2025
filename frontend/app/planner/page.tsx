"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import SearchForm from "../../components/search";
import Navigationbar from "@/components/navbar";

export default function Planner(){
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    return (
        <>
        <Navigationbar/>
        <SearchForm></SearchForm>
        </>
    )
}