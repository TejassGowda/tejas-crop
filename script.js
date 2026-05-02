let cropData = [];

// Fertilizer and disease info for crops (expand as needed)
const cropInfo = {
    "Beans": {
        fertilizer: "20-30 kg/ha Nitrogen, 50-60 kg/ha Phosphorus, 40-50 kg/ha Potassium. Use compost.",
        diseases: "Anthracnose, Root rot, Mosaic virus."
    },
    "Pea": {
        fertilizer: "20 kg/ha Nitrogen, 60 kg/ha Phosphorus, 40 kg/ha Potassium. Use organic manure.",
        diseases: "Powdery mildew, Fusarium wilt, Root rot."
    },
    "Maize": {
        fertilizer: "120 kg/ha Nitrogen, 60 kg/ha Phosphorus, 40 kg/ha Potassium. Split N application.",
        diseases: "Leaf blight, Downy mildew, Rust."
    },
    "Pulses": {
        fertilizer: "20-25 kg/ha Nitrogen, 40-50 kg/ha Phosphorus, 20 kg/ha Potassium.",
        diseases: "Wilt, Mosaic virus, Powdery mildew."
    },
    "Lentil": {
        fertilizer: "18-20 kg/ha Nitrogen, 40-60 kg/ha Phosphorus, 20-30 kg/ha Potassium.",
        diseases: "Rust, Wilt, Ascochyta blight."
    },
    "Tobacco": {
        fertilizer: "60-80 kg/ha Nitrogen, 40-50 kg/ha Phosphorus, 60-80 kg/ha Potassium.",
        diseases: "Black shank, Mosaic virus, Leaf spot."
    },
    "Groundnut": {
        fertilizer: "20-25 kg/ha Nitrogen, 40-60 kg/ha Phosphorus, 40-50 kg/ha Potassium.",
        diseases: "Leaf spot, Rust, Collar rot."
    },
    "Sugarcane": {
        fertilizer: "150 kg/ha Nitrogen, 60 kg/ha Phosphorus, 60 kg/ha Potassium.",
        diseases: "Red rot, Smut, Grassy shoot."
    },
    "Jute": {
        fertilizer: "40-60 kg/ha Nitrogen, 20-40 kg/ha Phosphorus, 20-40 kg/ha Potassium.",
        diseases: "Stem rot, Anthracnose."
    },
    "Soybean": {
        fertilizer: "20-30 kg/ha Nitrogen, 60-80 kg/ha Phosphorus, 40-60 kg/ha Potassium.",
        diseases: "Rust, Downy mildew, Anthracnose."
    },
    "Rice": {
        fertilizer: "100-120 kg/ha Nitrogen, 60 kg/ha Phosphorus, 40 kg/ha Potassium.",
        diseases: "Blast, Bacterial blight, Sheath blight."
    },
    "Wheat": {
        fertilizer: "120 kg/ha Nitrogen, 60 kg/ha Phosphorus, 40 kg/ha Potassium.",
        diseases: "Rust, Smut, Powdery mildew."
    },
    "Barley": {
        fertilizer: "60-80 kg/ha Nitrogen, 40-50 kg/ha Phosphorus, 40-50 kg/ha Potassium.",
        diseases: "Leaf rust, Powdery mildew."
    },
    "Tea": {
        fertilizer: "225 kg/ha Nitrogen, 37 kg/ha Phosphorus, 90 kg/ha Potassium.",
        diseases: "Blister blight, Root rot."
    },
    "Gram": {
        fertilizer: "20 kg/ha Nitrogen, 60 kg/ha Phosphorus, 40 kg/ha Potassium.",
        diseases: "Wilt, Ascochyta blight."
    },
    "Sunflower": {
        fertilizer: "60-80 kg/ha Nitrogen, 60-80 kg/ha Phosphorus, 40-60 kg/ha Potassium.",
        diseases: "Downy mildew, Rust."
    },
    "Millet": {
        fertilizer: "40-50 kg/ha Nitrogen, 20-30 kg/ha Phosphorus, 20-30 kg/ha Potassium.",
        diseases: "Downy mildew, Rust, Blast."
    },
    "Cotton": {
        fertilizer: "90-120 kg/ha Nitrogen, 45-60 kg/ha Phosphorus, 45-60 kg/ha Potassium.",
        diseases: "Wilt, Leaf curl, Boll rot."
    },
    "Sorghum": {
        fertilizer: "80-100 kg/ha Nitrogen, 40-50 kg/ha Phosphorus, 40-50 kg/ha Potassium.",
        diseases: "Downy mildew, Rust, Smut."
    },
    "Coffee": {
        fertilizer: "120 kg/ha Nitrogen, 90 kg/ha Phosphorus, 120 kg/ha Potassium.",
        diseases: "Leaf rust, Coffee berry disease."
    }
    // Add more crops as needed
};

// NPK and pH advice
function checkNPK(n, p, k, ph) {
    let advice = [];
    if (n < 20) advice.push("Nitrogen is low. Apply urea or ammonium sulfate.");
    else if (n > 60) advice.push("Nitrogen is high. Reduce N fertilizer.");

    if (p < 20) advice.push("Phosphorus is low. Apply DAP or superphosphate.");
    else if (p > 50) advice.push("Phosphorus is high. Avoid extra P fertilizer.");

    if (k < 20) advice.push("Potassium is low. Apply MOP (Muriate of Potash).");
    else if (k > 60) advice.push("Potassium is high. Avoid extra K fertilizer.");

    if (ph < 5.5) advice.push("Soil is acidic. Consider liming.");
    else if (ph > 7.5) advice.push("Soil is alkaline. Add organic matter or sulfur.");

    return advice.length ? advice.join(" ") : "NPK and pH levels are within recommended range.";
}

// Load the JSON dataset
fetch('crop_dataset.json')
    .then(response => response.json())
    .then(data => {
        cropData = data;
    })
    .catch(error => {
        document.getElementById('prediction').innerHTML = "<span style='color:red'>Failed to load crop dataset.</span>";
        console.error('Error loading dataset:', error);
    });

document.getElementById('cropForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const n = parseFloat(document.getElementById('nitrogen').value);
    const p = parseFloat(document.getElementById('phosphorus').value);
    const k = parseFloat(document.getElementById('potassium').value);
    const temp = parseFloat(document.getElementById('temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const ph = parseFloat(document.getElementById('ph').value);
    const soil = document.getElementById('soil').value.trim().toLowerCase();
    const season = document.getElementById('season').value.trim().toLowerCase();

    if ([n, p, k, temp, humidity, ph].some(isNaN) || !soil || !season) {
        document.getElementById('prediction').innerHTML = "Please fill all fields correctly.";
        return;
    }

    // Find matching crops
    const matches = cropData.filter(crop =>
        temp >= crop.tempRange[0] &&
        temp <= crop.tempRange[1] &&
        humidity >= crop.humidityRange[0] &&
        humidity <= crop.humidityRange[1] &&
        crop.soil.toLowerCase() === soil &&
        crop.season.toLowerCase() === season
    );

    // Show prediction
    if (matches.length === 0) {
        document.getElementById('prediction').innerHTML = "<b>No suitable crop found for the given conditions.</b>";
        document.getElementById('fertilizer').innerHTML = "No recommendation.";
        document.getElementById('diseases').innerHTML = "No data.";
        document.getElementById('npk').innerHTML = checkNPK(n, p, k, ph);
    } else {
        // Count frequency of each crop
        const freq = {};
        matches.forEach(c => {
            freq[c.crop] = (freq[c.crop] || 0) + 1;
        });
        // Sort by most frequent
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const topCrops = sorted.slice(0, 2).map(item => item[0]); // Show up to 2 best crops

        document.getElementById('prediction').innerHTML = `<b>Predicted Crop:</b> ${topCrops.join(', ')}`;

        // Show fertilizer and disease info for the top crop(s)
        let fert = "", dis = "";
        topCrops.forEach(crop => {
            fert += `<b>${crop}:</b> ${cropInfo[crop]?.fertilizer || "No data."}<br>`;
            dis += `<b>${crop}:</b> ${cropInfo[crop]?.diseases || "No data."}<br>`;
        });
        document.getElementById('fertilizer').innerHTML = fert;
        document.getElementById('diseases').innerHTML = dis;
        document.getElementById('npk').innerHTML = checkNPK(n, p, k, ph);
    }
});

// Reveal prediction section only after clicking Get Started
document.getElementById("getStartedBtn").addEventListener("click", function (e) {
    e.preventDefault();
    const predictSection = document.getElementById("predict");
    predictSection.style.display = "block";
    predictSection.classList.add("fade-in");
    window.scrollTo({
        top: predictSection.offsetTop,
        behavior: "smooth",
    });
});
