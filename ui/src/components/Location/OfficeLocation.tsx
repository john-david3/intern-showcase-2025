import {useEffect, useState} from "react";
import styles from "./OfficeLocation.module.css"
import OfficeSelectorWindow from "./OfficeSelectorWindow.tsx";
import americasImg from "../../assets/images/americas.png";
import emeaImg from "../../assets/images/emea.png"
import asiaImg from "../../assets/images/asia.png"


export type Office = {
    id: number;
    region: string;
    officename: string;
    address: string;
    city: string;
    country: string;
    postcode: string;
    picture: string;
}

type Region = {
    name: string;
    picture: string;
}

const regions: Region[] = [
    { name: "Americas", picture: americasImg },
    { name: "EMEA", picture: emeaImg },
    { name: "APCJ", picture: asiaImg }
]

const OfficeLocation = () => {

    const [offices, setOffices] = useState<Office[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
    const [isSelectorOpen, setSelectorOpen] = useState(false);

    useEffect(() => {
        const fetchOfficeLocation = async () => {
            try {
                const response = await fetch("http://localhost:5000/offices", {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to fetch groups");
                const data = await response.json();
                console.log(data);

                setOffices(data);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        };

        fetchOfficeLocation();
    }, []);

    const openSelector = (region: string) => {
        setSelectedRegion(region);
        setSelectorOpen(true);
    }

    const closeSelector = () => {
        setSelectorOpen(false);
    }


    const handleSave = async (region: string, office: Office | null, closeAfterSave = false) => {
        setSelectedRegion(region);
        if (office) {
            setSelectedOffice(office);

            try{
                fetch('http://localhost:5000/user/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({ office_id: office.id})
                });
            }
            catch (error){
                console.log(error);
            }
        }
        if (closeAfterSave) {
            setSelectorOpen(false);
        }
    }

    return (
        <section className={styles.officeLocation}>
            <h1>Select Your Office</h1>
            <section className={styles.regions}>
                {regions.map(region => (
                    <div key={region.name}
                        className={styles.regionCard}
                        onClick={() => openSelector(region.name)}
                        style={{ backgroundImage: `url(${region.picture})`}}>
                        <p>{region.name}</p>
                    </div>
                ))}
            </section>

            {isSelectorOpen && selectedRegion && (
                <OfficeSelectorWindow
                    region={selectedRegion}
                    offices={offices.filter(o => o.region === selectedRegion)}
                    selectedOffice={selectedOffice}
                    onClose={closeSelector}
                    onSave={handleSave}
                />
            )}

            {selectedOffice && (
                <p className={styles.selected}>
                    Selected: <strong>{selectedOffice.officename}</strong>
                </p>
            )}
        </section>
    )
}

export default OfficeLocation;