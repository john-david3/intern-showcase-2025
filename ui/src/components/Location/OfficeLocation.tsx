import {useEffect, useState} from "react";
import styles from "./OfficeLocation.module.css"
import OfficeSelectorWindow from "./OfficeSelectorWindow.tsx";

export type Office = {
    id: number;
    region: string;
    office: string;
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

const OfficeLocation = () => {

    const [offices, setOffices] = useState<Office[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
    const [isSelectorOpen, setSelectorOpen] = useState(false);

    const regions: Region[] = [
        {
            name: "Americas",
            picture: "../../public/images/americas.png"
        },
        {
            name: "EMEA",
            picture: "../../public/images/emea.png"
        },
        {
            name: "Asia",
            picture: "../../public/images/asia.png"
        }
    ]

    useEffect(() => {
        fetch('http://localhost:5000/offices').then(res => res.json()).then(setOffices);
    }, []);

    const openSelector = (region: string) => {
        setSelectedRegion(region);
        setSelectorOpen(true);
    }

    const closeSelector = () => {
        setSelectorOpen(false);
    }

    const handleSave = (region: string, office: Office | null, closeAfterSave = false) => {
        setSelectedRegion(region);
        if (office) {
            setSelectedOffice(office);
            fetch('http://localhost:5000/user/location', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ office_id: office.id})
            })
        }
        if (closeAfterSave) setSelectorOpen(false);
    }
    //
    // const handleOfficeClick = (office: Office) => {
    //     setSelectedOffice(office);
    //     fetch('http://localhost:5000/user/location', {
    //         method: 'POST',
    //         body: JSON.stringify({office_id: office.id})
    //     });
    // };

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
                    Selected: <strong>{selectedOffice.office}</strong>, {selectedOffice.city}
                </p>
            )}
        </section>
    )
}

export default OfficeLocation;