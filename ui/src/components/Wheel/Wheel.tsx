import React, {useState, type SetStateAction} from "react";
import SimpleWheel from "./SimpleWheel.tsx";
import {getOptions} from "../../utils/GetOptions.ts";

const DEFAULT_OPTIONS = [
    {option: 'Pizza', category: 'American', distance: 5, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Burger', category: 'American', distance: 3, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Sushi', category: 'Asian', distance: 8, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Tacos', category: 'Mexican', distance: 4, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Pasta', category: 'Mediterranean', distance: 6, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Salad', category: 'Office Favourites', distance: 2, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Chicken', category: 'Office Favourites', distance: 3, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Fish', category: 'Mediterranean', distance: 7, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Steak', category: 'American', distance: 10, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Soup', category: 'Office Favourites', distance: 1, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Sandwich', category: 'Office Favourites', distance: 2, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Rice Bowl', category: 'Asian', distance: 5, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
];

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
    const [options, setOptions] = getOptions("1", "option");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [maxDistance, setMaxDistance] = useState('all');
    const [excludedOptions, setExcludedOptions] = useState(new Set());
    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<NewOptionData>({
        option: "",
        category: "",
    })

    // Filter options based on category, distance, and exclusions
    const getFilteredOptions = () => {
        let filtered = options;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(option => option.category === selectedCategory);
        }

        if (maxDistance !== 'all') {
            filtered = filtered.filter(option => option.distance <= Number(maxDistance));
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
        setOptions(DEFAULT_OPTIONS);
        setSelectedOption(null);
        setExcludedOptions(new Set());
        setSelectedCategory('All');
        setMaxDistance('all');
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