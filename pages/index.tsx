import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Navbar from '../components/Navbar';
import Loadboard from "../components/Loadboard"
import Filters from "../components/Filters";

export default function IndexPage() {
	return (
		

		<div className="bg-grray-200  w-full h-full absolute   ">
		

		<Navbar/>
		<div className="mt-8 ml-14">

		<Filters/>

		</div>
		<div className=" p-14 bg-[">

		<Loadboard/>

		</div>
		</div>
		
		
	);
}
