import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@heroui/navbar";
import {Link} from "@heroui/link";
import {Button, ButtonGroup} from "@heroui/button";
import Slider from "../../components/Slider";



export default function App() {
  return (
    <>


    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">KiasuPlanner</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    <Slider/>
  
    </>
  );
}
