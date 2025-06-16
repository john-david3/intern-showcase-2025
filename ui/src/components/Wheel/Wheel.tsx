import {useState, type SetStateAction} from "react";
import SimpleWheel from "./SimpleWheel.tsx";

const DEFAULT_OPTIONS = [
    {option: 'Five Points', category: 'Sandwiches', distance: 5, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Sonnies Deli', category: 'Sandwiches', distance: 3, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'English Market', category: 'Sandwiches', distance: 8, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Boojum', category: 'Mexican', distance: 4, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Centra', category: 'Everything', distance: 6, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Scoozis', category: 'Italian', distance: 2, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
    {option: 'Marina Market', category: 'Everything', distance: 3, style: {backgroundColor: '#ff0000', color: '#f5f5f5'}},
    {option: 'Grumpy Baker', category: 'Sandwiches', distance: 2, style: {backgroundColor: '#f5f5f5', color: '#000000'}},
];

const CATEGORIES = ['All', 'Sandwiches', 'Mexican', 'Italian', 'Everything'];

function Wheel() {
    const [options, setOptions] = useState(DEFAULT_OPTIONS);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [maxDistance, setMaxDistance] = useState('all');
    const [excludedOptions, setExcludedOptions] = useState(new Set());

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

    const handleAddOption = (e) => {
        e.preventDefault();
        const { newOption, newCategory, newDistance } = e.target;

        if (newOption && !options.some(opt => opt.option === newOption)) {
            const newStyle = options.length % 2 === 0
                ? { backgroundColor: '#ff0000', color: '#f5f5f5' }
                : { backgroundColor: '#f5f5f5', color: '#000000' };
            setOptions([...options, { option: newOption, category: newCategory, distance: newDistance, style: newStyle }]);
        }
        // @ts-ignore
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
                    <input
                        type="text"
                        name="food"
                        placeholder="Enter a food"
                        required
                    />

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