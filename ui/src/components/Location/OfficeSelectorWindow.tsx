import styles from "./OfficeLocation.module.css"
import {useState} from "react";
import type {Office} from "./OfficeLocation.tsx";

interface OfficeSelectorProps {
    region: string;
    offices: Office[];
    selectedOffice: Office | null;
    onClose: () => void;
    onSave: (region: string, office: Office | null, closeAfterSave?: boolean) => void;
}

const OfficeSelectorWindow = ({
                                  region, offices, selectedOffice, onClose, onSave}: OfficeSelectorProps) => {
    const [tempOffice, setTempOffice] = useState<Office | null>(selectedOffice);
    const handleSelect = (office: Office) => {
        setTempOffice(office);
    };

    return (
        <div className={styles.selectorOverlay}>
            <div className={styles.selectorContainer}>
                <button onClick={onClose} className={styles.closeSelectorBtn}>
                    <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="34px" fill="white">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </a>
                </button>
                <h1>Offices in {region}</h1>
                <ul className={styles.officeList}>
                    {
                        offices.map(office => (
                            <li key={office.id}
                                onClick={() => handleSelect(office)}
                                className={`${styles.officeItem} ${tempOffice?.id === office.id ? styles.selected : ''}`}>
                                <img src={office.picture} alt={office.office} className={styles.officeImage} />
                                <p><strong>{office.office}</strong></p>
                            </li>
                        ))
                    }
                </ul>
                <section className={styles.buttons}>
                    <button onClick={onClose}>Close</button>
                    <button onClick={() => onSave(region, tempOffice)}>Save</button>
                    <button onClick={() => onSave(region, tempOffice, true)}>Save & Close</button>
                </section>
            </div>
        </div>
    );
};

export default OfficeSelectorWindow;