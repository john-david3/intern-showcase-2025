import Highlights from "../components/Highlights/Highlights.tsx";
import OfficeLocation from "../components/Location/OfficeLocation.tsx";
import Weather from "../components/Weather/Weather.tsx";
import Events from "../components/Events/Events.tsx";


const Home = () => {
    return (
        <section>
            <OfficeLocation />
            <Weather />
            <Events />
            <Highlights />
        </section>
    )
}

export default Home;
