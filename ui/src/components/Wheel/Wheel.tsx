import {useState, type SetStateAction} from "react";
import SimpleWheel from "./SimpleWheel.tsx";

const DEFAULT_OPTIONS = [
    {option: 'Five Points', category: 'Sandwiches', style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Sonnies Deli', category: 'Sandwiches', style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'English Market', category: 'Sandwiches', style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Boojum', category: 'Mexican', style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Centra', category: 'Everything', style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Scoozis', category: 'Italian', style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Marina Market', category: 'Everything', style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Grumpy Baker', category: 'Sandwiches', style: {backgroundColor: '#f5f5f5', color: '#000000'}},
];

const CATEGORIES = ['All', 'Sandwiches', 'Mexican', 'Italian', 'Everything'];

function Wheel() {
    const [options, setOptions] = useState(DEFAULT_OPTIONS);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [excludedOptions, setExcludedOptions] = useState(new Set());

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

    const handleAddOption = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newOption = formData.get("newOption");
        const newCategory = formData.get("newCategory");

        if (newOption) {
            const newStyle = options.length % 2 === 0
                ? { backgroundColor: '#ff0000', color: '#f5f5f5' }
                : { backgroundColor: '#f5f5f5', color: '#000000' };
            setOptions([
                ...options, {
                option: newOption,
                category: newCategory,
                style: newStyle
            }]);
        }

        e.target.reset();
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
                    <input
                        type="text"
                        name="newOption"
                        placeholder="Enter a food"
                        required
                    />

                    <select name="newCategory" required>
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