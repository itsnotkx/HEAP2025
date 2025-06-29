import {Link} from "@heroui/link";
import {Button, ButtonGroup} from "@heroui/button";
import Slider from "../../components/Slider";
import Navigationbar from "@/components/navbar";
import SearchForm from "../../components/FormBox";



export default function App() {
  return (
    <>
    <Navigationbar/>  
    
    <SearchForm></SearchForm>
    <Slider/>
     </>
  )
}
