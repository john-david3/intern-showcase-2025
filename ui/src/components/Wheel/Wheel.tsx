import React, {useState, useEffect, type SetStateAction} from "react";
import SimpleWheel from "./SimpleWheel.tsx";
import {getOptions} from "../../utils/GetOptions.ts";

const CATEGORIES = ['All', 'American', 'Asian', 'Mediterranean', 'Mexican', 'Office Favourites'];

interface NewOptionData {
    option: string;
    category: string;
}

interface FormErrors {
    option?: string;
    category?: string;
    general?: string;
}

function Wheel() {
    const [options, setOptions] = useState<NewOptionData[]>([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [excludedOptions, setExcludedOptions] = useState(new Set());
    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<NewOptionData>({
        option: "",
        category: "",
    })

    useEffect(() => {
        async function fetchOptions() {
            try{
                const res = await getOptions("1", "option");
                if (res.options){
                    setOptions(res.options);
                } else {
                    console.warn("No options received");
                }
            } catch (error) {
                console.error("Error fetching options", error);
            }

        }

        fetchOptions();
    }, [])

    // Filter options based on category, distance, and exclusions
    const getFilteredOptions = () => {
        let filtered = options;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(option => option.category === selectedCategory);
        }

        // Remove excluded options
        filtered = filtered.filter(option => !excludedOptions.has(option.option));

        return filtered;
    };

    const handleSpinComplete = (winner: { option: SetStateAction<null>; }) => {
        setSelectedOption(winner.option);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Check for empty fields
        Object.keys(formData).forEach((key) => {
            if (!formData[key as keyof NewOptionData]) {
                newErrors[key as keyof FormErrors] = "This field is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddOption = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch("http://localhost:5000/add_option", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                if (data.option_added){
                    console.log("Option has been added")
                } else {
                    console.log("Option has not been added")
                }

            } catch (error) {
                console.error("Error Login:", error);
                setErrors({
                    general: "An error occurred during login",
                });
            }
        }
    };

    const handleToggleExclude = (optionName: unknown) => {
        setExcludedOptions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(optionName)) {
                newSet.delete(optionName);
            } else {
                newSet.add(optionName);
            }
            return newSet;
        });

        // Clear selection if it was the excluded option
        if (selectedOption === optionName) {
            setSelectedOption(null);
        }
    };

    const handleReset = () => {
        setOptions([]);
        setSelectedOption(null);
        setExcludedOptions(new Set());
        setSelectedCategory('All');
    };

    const filteredOptions = getFilteredOptions();

    return (
        <section>
            <section className="wheel">
                <h2>Spin the Wheel of Food!</h2>
                <label>Category:</label>
                <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                {filteredOptions.length > 0 ? (
                    <SimpleWheel items={filteredOptions} onSpinComplete={handleSpinComplete} />
                ) : (
                    <section className="wheeler">
                        No options available<br/>for this filter
                    </section>
                )}

                <section>
                    <button onClick={handleReset}>
                        Reset All
                    </button>
                </section>

                {selectedOption && (
                    <section id="winner">
                        <h3>🎉 Winner: {selectedOption}!</h3>
                    </section>
                )}

            </section>

            <section className="options-section">
                <h2>Food Options ({options.length})</h2>
                <ul>
                    {options.map((option) => {
                        const isExcluded = excludedOptions.has(option.option);

                        return (
                            <li key={option.option}>
                                {option.option}
                                <small>({option.category})</small>

                                <button
                                    onClick={() => handleToggleExclude(option.option)}
                                    title={isExcluded ? "Include" : "Exclude"}
                                >
                                    {isExcluded ? '✓' : '✗'}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <h2>Add a Place</h2>
                <form onSubmit={handleAddOption}>
                    {errors.option && (
                        <p>{errors.option}</p>
                    )}
                    <input
                        type="text"
                        name="food"
                        placeholder="Enter a food"
                        onChange={handleInputChange}
                        required
                    />

                    {errors.category && (
                        <p>{errors.category}</p>
                    )}
                    <select name="category" required>
                        {CATEGORIES.slice(1).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <button type="submit">Add Option</button>
                </form>
            </section>
        </section>
    );
}

export default Wheel;