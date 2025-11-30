import { useState, useEffect } from "react";
import { ChevronDown, Check, AlertCircle, DollarSign } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

export default function PackageCustomization({
    packageData,
    data,
    setData,
    errors,
}) {
    const [selectedFoods, setSelectedFoods] = useState(
        data.selected_foods || []
    );
    const [totalFoodCost, setTotalFoodCost] = useState(0);
    const [budgetExceeded, setBudgetExceeded] = useState(false);

    // Calculate total food cost whenever selected foods change
    useEffect(() => {
        const total = selectedFoods.reduce(
            (sum, food) => sum + parseFloat(food.price || 0),
            0
        );
        setTotalFoodCost(total);

        // Check if budget is exceeded
        const basePrice = parseFloat(packageData.base_price || 0);
        setBudgetExceeded(total > basePrice);

        // Update parent data
        setData("selected_foods", selectedFoods);
    }, [selectedFoods]);

    const handleTableChange = (e) => {
        setData("selected_table_type", e.target.value);
    };

    const handleChairChange = (e) => {
        setData("selected_chair_type", e.target.value);
    };

    const handleFoodToggle = (food) => {
        const isSelected = selectedFoods.some((f) => f.name === food.name);

        if (isSelected) {
            // Remove food
            setSelectedFoods(selectedFoods.filter((f) => f.name !== food.name));
        } else {
            // Add food
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    const isFoodSelected = (food) => {
        return selectedFoods.some((f) => f.name === food.name);
    };

    const remainingBudget =
        parseFloat(packageData.base_price || 0) - totalFoodCost;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Package Customization
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                    Customize your package with your preferred table, chair, and
                    food selections.
                </p>
            </div>

            {/* Package Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-slate-800">
                            {packageData.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                            {packageData.description}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-600">Base Price</p>
                        <p className="text-xl font-bold text-amber-700">
                            ₱
                            {parseFloat(packageData.base_price).toLocaleString(
                                "en-US",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Selection */}
            <div>
                <InputLabel
                    htmlFor="selected_table_type"
                    value="Table Type *"
                />
                <div className="relative mt-2">
                    <select
                        id="selected_table_type"
                        value={data.selected_table_type || ""}
                        onChange={handleTableChange}
                        className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors appearance-none bg-white"
                        required
                    >
                        <option value="">Select a table type</option>
                        {packageData.available_tables &&
                            packageData.available_tables.map((table, index) => (
                                <option key={index} value={table}>
                                    {table}
                                </option>
                            ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                <InputError
                    message={errors.selected_table_type}
                    className="mt-2"
                />
            </div>

            {/* Chair Selection */}
            <div>
                <InputLabel
                    htmlFor="selected_chair_type"
                    value="Chair Type *"
                />
                <div className="relative mt-2">
                    <select
                        id="selected_chair_type"
                        value={data.selected_chair_type || ""}
                        onChange={handleChairChange}
                        className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors appearance-none bg-white"
                        required
                    >
                        <option value="">Select a chair type</option>
                        {packageData.available_chairs &&
                            packageData.available_chairs.map((chair, index) => (
                                <option key={index} value={chair}>
                                    {chair}
                                </option>
                            ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                <InputError
                    message={errors.selected_chair_type}
                    className="mt-2"
                />
            </div>

            {/* Food Selection */}
            <div>
                <InputLabel value="Food Selections *" />
                <p className="text-sm text-slate-600 mt-1 mb-3">
                    Select food items within your package budget
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    {packageData.available_foods &&
                    packageData.available_foods.length > 0 ? (
                        packageData.available_foods.map((food, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                    isFoodSelected(food)
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-slate-200 hover:border-amber-300"
                                }`}
                                onClick={() => handleFoodToggle(food)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                            isFoodSelected(food)
                                                ? "border-amber-500 bg-amber-500"
                                                : "border-slate-300"
                                        }`}
                                    >
                                        {isFoodSelected(food) && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <span className="font-medium text-slate-800">
                                        {food.name}
                                    </span>
                                </div>
                                <span className="font-semibold text-slate-700">
                                    ₱
                                    {parseFloat(food.price).toLocaleString(
                                        "en-US",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">
                            No food options available for this package
                        </p>
                    )}
                </div>
                <InputError message={errors.selected_foods} className="mt-2" />
            </div>

            {/* Budget Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Package Budget:</span>
                    <span className="font-semibold text-slate-800">
                        ₱
                        {parseFloat(packageData.base_price).toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Total Food Cost:</span>
                    <span className="font-semibold text-slate-800">
                        ₱
                        {totalFoodCost.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </div>
                <div className="border-t border-slate-300 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">
                            Remaining Budget:
                        </span>
                        <span
                            className={`text-lg font-bold ${
                                budgetExceeded
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            ₱
                            {Math.abs(remainingBudget).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Budget Exceeded Warning */}
            {budgetExceeded && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-800">
                            Budget Exceeded
                        </h4>
                        <p className="text-sm text-red-700 mt-1">
                            Your food selections exceed the package budget by ₱
                            {Math.abs(remainingBudget).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                            . Please remove some items to continue.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
