let currentPairs = [];
let pendingAction = null;

function updateStats() {
    const list1Items = document.getElementById('list1').value.split('\n').filter(item => item.trim());
    const list2Items = document.getElementById('list2').value.split('\n').filter(item => item.trim());

    document.getElementById('list1Count').textContent = list1Items.length;
    document.getElementById('list2Count').textContent = list2Items.length;
    document.getElementById('pairedCount').textContent = currentPairs.length;
}

function showDialog(message, confirmAction) {
    document.getElementById('dialogMessage').textContent = message;
    document.getElementById('confirmDialog').style.display = 'flex';
    pendingAction = confirmAction;
}

function closeDialog() {
    document.getElementById('confirmDialog').style.display = 'none';
    pendingAction = null;
}

function handleDialogConfirm() {
    if (pendingAction) {
        pendingAction();
    }
    closeDialog();
}

function showClearConfirmation() {
    showDialog('Are you sure you want to clear all data?', clearAll);
}

function generatePairs(mode) {
    if (currentPairs.length > 0) {
        showDialog('This will replace existing pairs. Continue?', () => executePairing(mode));
        return;
    }
    executePairing(mode);
}

function executePairing(mode) {
    const list1Items = document.getElementById('list1').value.split('\n').filter(item => item.trim());
    const list2Items = document.getElementById('list2').value.split('\n').filter(item => item.trim());

    if (list1Items.length === 0 || list2Items.length === 0) {
        alert('Please enter items in both lists');
        return;
    }

    currentPairs = [];
    const maxPairs = Math.min(list1Items.length, list2Items.length);

    if (mode === 'random') {
        const shuffled2 = [...list2Items].sort(() => Math.random() - 0.5);
        for (let i = 0; i < maxPairs; i++) {
            currentPairs.push([list1Items[i], shuffled2[i]]);
        }
    } else {
        for (let i = 0; i < maxPairs; i++) {
            currentPairs.push([list1Items[i], list2Items[i]]);
        }
    }

    displayPairs();
    updateStats();
}

function displayPairs() {
    const list = document.getElementById('pairsList');
    list.innerHTML = '';

    currentPairs.forEach((pair, index) => {
        const pairDiv = document.createElement('div');
        pairDiv.className = 'pair-item';
        pairDiv.innerHTML = `
            <span class="pair-number">${index + 1}.</span>
            <div class="pair-content">
                <span>${pair[0]}</span>
                <span>⟷</span>
                <span>${pair[1]}</span>
            </div>
        `;
        list.appendChild(pairDiv);
    });
}

function clearAll() {
    document.getElementById('list1').value = '';
    document.getElementById('list2').value = '';
    currentPairs = [];
    displayPairs();
    updateStats();
}

function exportToExcel() {
    if (currentPairs.length === 0) {
        alert('No pairs to export');
        return;
    }

    const ws = XLSX.utils.aoa_to_sheet([
        ['Pair #', 'List 1', 'List 2'],
        ...currentPairs.map((pair, index) => [index + 1, pair[0], pair[1]])
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pairs');
    XLSX.writeFile(wb, 'paired_items.xlsx');
}

// Event listeners for input changes
document.getElementById('list1').addEventListener('input', updateStats);
document.getElementById('list2').addEventListener('input', updateStats);
