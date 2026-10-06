//a - all in
//c - call
function fu(r, a, c) {
	let pi = new Array(67, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32,
		45, 61, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28,
		44, 40, 58, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26,
		43, 39, 37, 55, 32, 31, 30, 29, 28, 27, 26, 25, 24,
		42, 38, 36, 34, 52, 29, 28, 27, 26, 25, 24, 23, 22,
		41, 37, 35, 33, 31, 49, 26, 25, 24, 23, 22, 21, 20,
		40, 36, 34, 32, 30, 28, 46, 23, 22, 21, 20, 19, 18,
		39, 35, 33, 31, 29, 27, 25, 43, 20, 19, 18, 17, 16,
		38, 34, 32, 30, 28, 26, 24, 22, 40, 17, 16, 15, 14,
		37, 33, 31, 29, 27, 25, 23, 21, 19, 37, 14, 13, 12,
		36, 32, 30, 28, 26, 24, 22, 20, 18, 16, 34, 11, 10,
		35, 31, 29, 27, 25, 23, 21, 19, 17, 15, 13, 31, 8,
		34, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 28);

	let row;
	let t = el("ct");
	for (i = 0; i < 13; i++) {
		row = t.rows[i];
		for (j = 0; j < 13; j++)
			row.cells[j].style.visibility = "hidden";
	}

	for (i = 0; i < 13; i++) {
		row = t.rows[i];
		for (j = 0; j < 13; j++) {
			k = j * 13 + i;
			if (pi[k] >= a) {
				if (pi[k] >= c)
					row.cells[j].style.color = 'green';
				else
					row.cells[j].style.color = 'red';
				row.cells[j].style.visibility = "visible";
			}
			else {
				if (pi[k] >= c) {
					row.cells[j].style.color = 'blue';
					row.cells[j].style.visibility = "visible";
				}
			}//else
		}//for(j)
	}//for(i)
	t.rows[8].cells[13].innerHTML = "<b>R=" + r + "</b>";

}

function load() {
	fu(1, 17, 0);
}