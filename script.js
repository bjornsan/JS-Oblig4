window.onload = startup;

function startup() {
	let string = "";

	let getFile = document.getElementById('getFile');
	getFile.addEventListener('change', fileReader);

	let changeLocation = document.getElementById('options');
	changeLocation.addEventListener('change', updateArray);

	let viewBasedOnLocation = document.getElementById('location');
	viewBasedOnLocation.addEventListener('click', updateArray);

	let viewBasedOnTransactionTypes = document.getElementById('transaction');
	viewBasedOnTransactionTypes.addEventListener('click', updateArray);


	function fileReader(event) {
		let file = event.target.files[0];
		let fileReader = new FileReader();

		fileReader.readAsText(file);

		fileReader.onload = function (event) {
			string = event.target.result;
			main(string)
		}
	}

	function updateArray(event) {
		main(string, event)
	}
}



/*
 * Manipulating the data received from csv file
 */
function stringToArray(string) {
	let arraySplitByLine = string.split('\n');

	for (let i = 0; i < arraySplitByLine.length; i++) {
		arraySplitByLine[i] = arraySplitByLine[i].split(",");
		arraySplitByLine[i][3] = parseInt(arraySplitByLine[i][3]);
	}
	return arraySplitByLine;
}
function splitArray(array) {
	const option = document.getElementById("options");

	if (option.value == "All") {
		return getAllData(array);
	} else {
		return getSpecificData(array, option.value);
	}
}
function getAllData(array) {

	const newArray = [];

	for (let i = 0; i < array.length; i++) {
		array[i].splice(2, 1);
		newArray.push(array[i]);
	}
	return newArray
}
function getSpecificData(array, optionValue) {

	const newArray = [];

	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; j++) {
			if (array[i][j] == optionValue) {
				array[i].splice(2, 1);
				newArray.push(array[i]);
			}
		}
	}
	return newArray;
}
function findUnique(array, field) {
	let unique = [];

	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array[i].length; j++) {
			unique[i] = array[i][field];
		}
	}
	unique = Array.from(new Set(unique));
	return unique;
}
function getField(array, field) {
	const newArray = [];

	for (let i = 0; i < array.length; i++) {
		newArray.push(array[i][2]);
	}

	return newArray;
}



/*
 * Populating the available options in drop down menu
 */
function populateOptionsBasedOnSelectedData(locationButton, transactionButton, original2dArray) {
	let uniqueLocations = [];

	if (locationButton.checked) {
		uniqueLocations = findUnique(original2dArray, 2);
		populateOptions(uniqueLocations)
	} else if (transactionButton.checked) {
		uniqueLocations = findUnique(original2dArray, 1);
		populateOptions(uniqueLocations)
	}
}
function populateOptions(array) {

	let select = document.getElementById("options");

	if (select.hasChildNodes()) {
		removeOptions(select);
	}

	addOptions(select, array);
}
function removeOptions(allValues) {
	allValues.innerHTML = "";
}
function addOptions(select, array) {
	const selectAllData = document.createElement('option');
	selectAllData.innerHTML = "All";
	selectAllData.value = "All";
	select.appendChild(selectAllData);

	array.forEach(option => {
		let createOption = document.createElement('option');
		createOption.innerHTML = option;
		createOption.value = option;
		select.appendChild(createOption)
	});
}



/*
 * Calculations
 */
function average(array) {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
			sum += array[i];
	}
	let avg = sum / array.length;
	return avg.toFixed(0);
}
function maximum(array) {
	let max = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] > max) {
			max = array[i];
		}
	}
	return max;
}
function minimum(array) {
	let min = Number.POSITIVE_INFINITY;

	for (let i = 0; i < array.length; i++) {
		if (array[i] < min) {
			min = array[i];
		}
	}
	return min;
}
function calculateStatistics(selectedData) {
	let listOfTransactions = getField(selectedData, 2);

	let avg = average(listOfTransactions);
	let max = maximum(listOfTransactions);
	let min = minimum(listOfTransactions);

	const statisticsArray = [max, min, avg];
	return statisticsArray;
}
function getDataForStatistics(array, field) {

	let uniques = findUnique(array, field)
	let values = []
	let maxValues = []

	for (let i = 0; i < uniques.length; i++) {
		values = [];
		maxValues[i] = []
		for (let j = 0; j < array.length; j++) {
			if (array[j][field] === uniques[i]) {
				values.push(array[j][3]);
			}
		}
		let maxValuePerItem = maximum(values)
		maxValues[i].push(uniques[i], maxValuePerItem);
	}
	return maxValues;
}
function selectDataForDiagram(locationButton, transactionButton, original2dArray) {
	if (locationButton.checked) {
		return getDataForStatistics(original2dArray, 2);
	}
	else if (transactionButton.checked) {
		return getDataForStatistics(original2dArray, 1);
	}
}




/*
 * OUTPUT
	*/
function printDataToTable(array) {

	const table1 = document.getElementById("tbl");
	const table = document.createElement("table");

	clearTable(table1);
	printDataHeaders(table);
	printDataRows(table, array);

	table1.appendChild(table);

}
function printStatisticsToTable(funcArr) {
	const table = document.createElement("table");
	const table2 = document.getElementById("tbl2");

	clearTable(table2);
	printStatHeaders(table);
	printStatRows(table, funcArr);

	table2.appendChild(table)

}
function drawStatisticsDiagram(array, selectedCity) {
	let canvas = document.getElementById("myCanvas");
	let ctx = canvas.getContext("2d");

	const total = calculatingTotalExpenses(array);

	clearCanvas(ctx, canvas);
	setupCanvas(canvas, ctx, total, array);
	drawGraph(array, selectedCity, canvas, ctx, total);
}



function clearTable(table) {
	table.innerHTML = "";
}
function printDataHeaders(table) {
	const tblHead = document.createElement("tr");
	const th = document.createElement("th");
	const th1 = document.createElement("th");
	const th2 = document.createElement("th");

	th.innerHTML = "Date: ";
	th1.innerHTML = "Transaction type: ";
	th2.innerHTML = "Amount: ";

	tblHead.appendChild(th);
	tblHead.appendChild(th1);
	tblHead.appendChild(th2);
	table.appendChild(tblHead);
}
function printDataRows(table, array) {

	for (let i = 0; i < array.length; i++) {
		let tr = document.createElement("tr");

		for (let j = 0; j < array[i].length; j++) {
			let td = document.createElement("td");
			td.innerHTML = array[i][j];
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
}
function printStatHeaders(table) {

	const trHead = document.createElement("tr");
	const th = document.createElement("th");
	const th1 = document.createElement("th");
	const th2 = document.createElement("th");

	th.innerHTML = "Biggest amount: ";
	th1.innerHTML = "Lowest amount: ";
	th2.innerHTML = "Average amount: ";

	trHead.appendChild(th);
	trHead.appendChild(th1);
	trHead.appendChild(th2);
	table.appendChild(trHead);

}
function printStatRows(table, funcArr) {
	const tr = document.createElement("tr");

	for (let i = 0; i < funcArr.length; i++) {
		let td = document.createElement("td");
		td.innerHTML = funcArr[i];
		tr.appendChild(td);
	}

	table.appendChild(tr);
}



function clearCanvas(ctx, canvas) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function setupCanvas(canvas, ctx, total, array, selectedCity) {
	ctx.font = "18px monospace";  //Setting the font of the text to 18px monospace
	drawYAxis(ctx);
	drawingXAxis(canvas, ctx, total);
}
function drawYAxis(ctx) {
	ctx.beginPath();
	ctx.moveTo(100, 10);
	ctx.lineTo(100, 360);
	ctx.stroke();
}
function calculatingTotalExpenses(array) {
	let total = 0;		//variable to count the total expenses

	//calculating maximum expenses
	array.forEach(array => {
		total += array[1];
	});

	return total;
}
function drawingXAxis(canvas, ctx, total) {
	//calculating where to draw the horizontal lines, and where to write the numbers for the y-axis
	let scale = canvas.height / total;
	for (let i = 0; i <= total; i += 400) {

		const mirror = Math.abs(i - total) * scale;
		ctx.fillText(i, 20, mirror - 40);
		ctx.beginPath();
		ctx.moveTo(80, mirror - 40);
		ctx.lineTo(750, mirror - 40);
		ctx.stroke();
	}
}
function drawGraph(array, selectedCity, canvas, ctx, total) {
	let indent = canvas.width / (array.length + 1);
	let xPos = indent;

	array.forEach(array => {
		let height = canvas.height * array[1] / total;
		if (array[0] === selectedCity) {
			ctx.fillStyle = "dodgerblue";
		} else {
			ctx.fillStyle = "coral";
		}

		//			bar name		placement on x-axxis
		ctx.fillText(array[0], xPos - (array[0].length * 2), canvas.height - 25);
		//			bar total sum
		ctx.fillText(array[1] + " kr", xPos - (array[0].length), canvas.height - 5);
		//			filling the rectangles with color
		ctx.fillRect(xPos, canvas.height - height - 40, 50, height);
		xPos += indent;

	});
}



/*
 * MAIN FUNCTION
 */
function main(string, event) {
	const locationButton = document.getElementById("location");
	const transactionButton = document.getElementById('transaction');
	const selectedOption = document.getElementById('options').value;

	const original2dArray = stringToArray(string);
	const copyOfOriginal2dArray = stringToArray(string);
	const selectedData = splitArray(copyOfOriginal2dArray);

	populateOptionsBasedOnSelectedData(locationButton, transactionButton, original2dArray);

	const statistics = calculateStatistics(selectedData);
	const dataToDiagram = selectDataForDiagram(locationButton, transactionButton, original2dArray);

	printDataToTable(selectedData);
	printStatisticsToTable(statistics);
	drawStatisticsDiagram(dataToDiagram, selectedOption);
}