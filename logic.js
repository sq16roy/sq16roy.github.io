// Función para obtener datos de un archivo JSON
const getHistoricalData = async () => {
	const response = await fetch("historicalData.json");
	const data = await response.json();
	return data;
};

// Función para formatear los datos históricos y filtrar números inválidos
const formatHistoricalData = (data) => {
	console.log(
		data
			.map((entry) =>
				entry.results_winnerresults
					.split(",")
					.map((num) => parseInt(num, 10))
					.filter((num) => num >= 1 && num <= 40)
			)
			.filter((arr) => arr.length >= 5)
			.slice(-250)
	);
	return data
		.map((entry) =>
			entry.results_winnerresults
				.split(",")
				.map((num) => parseInt(num, 10))
				.filter((num) => num >= 1 && num <= 40)
		)
		.filter((arr) => arr.length >= 5)
		.slice(-250);
};

// Función para obtener datos de la API
const getNumeros = async () => {
	const response = await fetch(
		"https://integration.jps.go.cr/api/App/lotto/page"
	);
	const data = await response.json();
	return data;
};

// Función para generar números de Lotto
const generateLottoNumbers = (lastDraw, pastDraws, count = 10) => {
	const numbers = Array.from({ length: 40 }, (_, i) => i + 1);

	const calculateFrequency = (draws) => {
		const frequency = Array(41).fill(0);
		draws.forEach((draw) => {
			draw.forEach((num) => {
				frequency[num]++;
			});
		});
		return frequency;
	};

	const categorizeNumbers = (frequency, threshold) => {
		const hotNumbers = [];
		const coldNumbers = [];
		for (let i = 1; i <= 40; i++) {
			if (frequency[i] >= threshold) {
				hotNumbers.push(i);
			} else {
				coldNumbers.push(i);
			}
		}
		return { hotNumbers, coldNumbers };
	};

	const calculatePairFrequency = (draws) => {
		const pairFrequency = {};
		draws.forEach((draw) => {
			for (let i = 0; i < draw.length; i++) {
				for (let j = i + 1; j < draw.length; j++) {
					const pair = [draw[i], draw[j]]
						.sort((a, b) => a - b)
						.join(",");
					pairFrequency[pair] = (pairFrequency[pair] || 0) + 1;
				}
			}
		});
		return pairFrequency;
	};

	const calculateTripletFrequency = (draws) => {
		const tripletFrequency = {};
		draws.forEach((draw) => {
			for (let i = 0; i < draw.length; i++) {
				for (let j = i + 1; j < draw.length; j++) {
					for (let k = j + 1; k < draw.length; k++) {
						const triplet = [draw[i], draw[j], draw[k]]
							.sort((a, b) => a - b)
							.join(",");
						tripletFrequency[triplet] =
							(tripletFrequency[triplet] || 0) + 1;
					}
				}
			}
		});
		return tripletFrequency;
	};

	const performClusterAnalysis = (draws) => {
		const clusters = {};
		for (let i = 1; i <= 40; i++) {
			clusters[i] = new Set();
		}
		draws.forEach((draw) => {
			draw.forEach((num) => {
				if (num >= 1 && num <= 40) {
					// Verificación adicional
					draw.forEach((otherNum) => {
						if (
							otherNum >= 1 &&
							otherNum <= 40 &&
							num !== otherNum
						) {
							// Verificación adicional
							clusters[num].add(otherNum);
						}
					});
				}
			});
		});
		return clusters;
	};

	const selectNumbersFromPool = (pool, count) => {
		const selected = [];
		while (selected.length < count) {
			const randomIndex = Math.floor(Math.random() * pool.length);
			const num = pool[randomIndex];
			if (!selected.includes(num)) {
				selected.push(num);
				pool.splice(randomIndex, 1);
			}
		}
		return selected;
	};

	const generateCombination = (
		hotNumbers,
		coldNumbers,
		pairFrequency,
		tripletFrequency,
		clusters,
		lastDraw
	) => {
		let selectedNumbers = [];
		const availableHotNumbers = hotNumbers.filter(
			(num) => !lastDraw.includes(num)
		);
		const availableColdNumbers = coldNumbers.filter(
			(num) => !lastDraw.includes(num)
		);

		selectedNumbers = selectedNumbers.concat(
			selectNumbersFromPool(availableHotNumbers, 2)
		);
		selectedNumbers = selectedNumbers.concat(
			selectNumbersFromPool(availableColdNumbers, 3)
		);

		let evenCount = selectedNumbers.filter((num) => num % 2 === 0).length;
		while (evenCount < 2 || evenCount > 3) {
			const changeIndex = Math.floor(Math.random() * 5);
			if (evenCount < 2) {
				selectedNumbers[changeIndex] = selectNumbersFromPool(
					numbers.filter(
						(num) => num % 2 === 0 && !lastDraw.includes(num)
					),
					1
				)[0];
				evenCount++;
			} else if (evenCount > 3) {
				selectedNumbers[changeIndex] = selectNumbersFromPool(
					numbers.filter(
						(num) => num % 2 !== 0 && !lastDraw.includes(num)
					),
					1
				)[0];
				evenCount--;
			}
		}

		selectedNumbers = balancePairTripletFrequency(
			selectedNumbers,
			pairFrequency,
			tripletFrequency
		);
		selectedNumbers = diversifyByClusters(selectedNumbers, clusters);

		selectedNumbers.sort((a, b) => a - b);

		const sum = selectedNumbers.reduce((a, b) => a + b, 0);
		if (sum < 83 || sum > 148) {
			return generateCombination(
				availableHotNumbers,
				availableColdNumbers,
				pairFrequency,
				tripletFrequency,
				clusters,
				lastDraw
			);
		}

		return selectedNumbers;
	};

	const balancePairTripletFrequency = (
		selectedNumbers,
		pairFrequency,
		tripletFrequency
	) => {
		const pairs = [];
		for (let i = 0; i < selectedNumbers.length; i++) {
			for (let j = i + 1; j < selectedNumbers.length; j++) {
				const pair = [selectedNumbers[i], selectedNumbers[j]]
					.sort((a, b) => a - b)
					.join(",");
				pairs.push({ pair, frequency: pairFrequency[pair] || 0 });
			}
		}

		const triplets = [];
		for (let i = 0; i < selectedNumbers.length; i++) {
			for (let j = i + 1; j < selectedNumbers.length; j++) {
				for (let k = j + 1; k < selectedNumbers.length; k++) {
					const triplet = [
						selectedNumbers[i],
						selectedNumbers[j],
						selectedNumbers[k],
					]
						.sort((a, b) => a - b)
						.join(",");
					triplets.push({
						triplet,
						frequency: tripletFrequency[triplet] || 0,
					});
				}
			}
		}

		pairs.sort((a, b) => b.frequency - a.frequency);
		triplets.sort((a, b) => b.frequency - a.frequency);

		const minPairFrequency = Math.min(...pairs.map((p) => p.frequency));
		const minTripletFrequency = Math.min(
			...triplets.map((t) => t.frequency)
		);

		if (minPairFrequency === 0) {
			const newPair = pairs[0].pair.split(",").map(Number);
			selectedNumbers = Array.from(
				new Set([...selectedNumbers, ...newPair])
			);
		}

		if (minTripletFrequency === 0) {
			const newTriplet = triplets[0].triplet.split(",").map(Number);
			selectedNumbers = Array.from(
				new Set([...selectedNumbers, ...newTriplet])
			);
		}

		return selectedNumbers.slice(0, 5);
	};

	const diversifyByClusters = (selectedNumbers, clusters) => {
		const newSelectedNumbers = [];
		const usedClusters = new Set();

		for (let num of selectedNumbers) {
			const numClusters = clusters[num];
			if (numClusters) {
				let unique = true;
				for (let clusterNum of numClusters) {
					if (usedClusters.has(clusterNum)) {
						unique = false;
						break;
					}
				}
				if (unique) {
					newSelectedNumbers.push(num);
					numClusters.forEach((clusterNum) =>
						usedClusters.add(clusterNum)
					);
				}
			}
		}

		while (newSelectedNumbers.length < 5) {
			const remainingNumbers = selectedNumbers.filter(
				(num) => !newSelectedNumbers.includes(num)
			);
			if (remainingNumbers.length === 0) break;
			newSelectedNumbers.push(remainingNumbers[0]);
		}

		return newSelectedNumbers.slice(0, 5);
	};

	const generateMultipleCombinations = (
		count,
		hotNumbers,
		coldNumbers,
		pairFrequency,
		tripletFrequency,
		clusters,
		lastDraw
	) => {
		const combinationsSet = new Set();
		while (combinationsSet.size < count) {
			const combination = generateCombination(
				hotNumbers,
				coldNumbers,
				pairFrequency,
				tripletFrequency,
				clusters,
				lastDraw
			);
			combinationsSet.add(combination.join(","));
		}
		const combinations = Array.from(combinationsSet).map((combo) =>
			combo.split(",").map(Number)
		);
		return combinations;
	};

	const frequency = calculateFrequency(pastDraws);
	const threshold = Math.max(...frequency) / 2;
	const { hotNumbers, coldNumbers } = categorizeNumbers(frequency, threshold);
	const pairFrequency = calculatePairFrequency(pastDraws);
	const tripletFrequency = calculateTripletFrequency(pastDraws);
	const clusters = performClusterAnalysis(pastDraws);

	const combinations = generateMultipleCombinations(
		count,
		hotNumbers,
		coldNumbers,
		pairFrequency,
		tripletFrequency,
		clusters,
		lastDraw
	);

	return combinations;
};

// Obtener los números y generar las combinaciones
const main = async () => {
	const historicalData = await getHistoricalData();
	const historicalDraws = formatHistoricalData(historicalData); // Formatear los datos históricos
	const apiData = await getNumeros();

	const pastDraws = historicalDraws.concat(
		apiData.map((draw) => draw.numeros)
	);
	const lastDraw = apiData[0].numeros;

	const count = parseInt(document.getElementById("cantidad").value, 10);
	const combinations = generateLottoNumbers(lastDraw, pastDraws, count);
	displayResults(apiData, combinations);
};

const displayResults = (data, combinations) => {
	const lastDraw = data[0].numeros.sort((a, b) => a - b);
	const acumulado = data[0].premiosLotto.acumulado;

	document.getElementById("ultimo").textContent = lastDraw.join(", ");
	document.getElementById("acumulado").textContent = acumulado.toLocaleString(
		"es-ES",
		{ style: "currency", currency: "CRC" }
	);

	const lista = document.getElementById("lista");
	lista.innerHTML = "";
	combinations.forEach((combination, index) => {
		const listItem = document.createElement("li");
		listItem.textContent = `(${combination.join(", ")})`;
		lista.appendChild(listItem);
	});
};

document.getElementById("generador").addEventListener("click", main);
