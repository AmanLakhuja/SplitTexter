
/*
This file is part of [SplitTexter] https://github.com/AmanLakhuja/SplitTexter .

Copyright (C) [Aman Lakhuja] [2025]

This program is licensed under the Server Side Public License, version 1,
as published by MongoDB, Inc.

You may obtain a copy of the SSPL at
https://www.mongodb.com/licensing/server-side-public-license
*/




window.addEventListener('pageshow', () => {
  document.body.style.display = 'none';
  requestAnimationFrame(() => {
    document.body.style.display = '';
  });
});



// Elements
const input = document.getElementById('input');
const output = document.getElementById('output');
const separationPointInput = document.getElementById('separationPoint');
const separatedByInput = document.getElementById('separatedBy');
const removeSeparator = document.getElementById('removeSeparator');
const addNewLine = document.getElementById('addNewLine');
const prefixInput = document.getElementById('prefix');
const suffixInput = document.getElementById('suffix');
const copyBtn = document.getElementById('copyBtn');
const pasteBtn = document.getElementById('pasteBtn');
const clearInputsBtn = document.getElementById('clearInputsBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copiedIndicator = document.getElementById('copiedIndicator');
const noTrailingSeparator = document.getElementById('noTrailingSeparator');
const noTrailing_prefix_suffix = document.getElementById('noTrailing_prefix_suffix');


function processText() {
  const text = input.value;
  const sepPoint = separationPointInput.value;
  const sepBy = separatedByInput.value;
  const removeSep = removeSeparator.checked;
  const newline = addNewLine.checked;
  const prefix = prefixInput.value || '';
  const suffix = suffixInput.value || '';
  const noTrailingSep = noTrailingSeparator.checked;
  const noTrailing_pref_suf = noTrailing_prefix_suffix.checked;

  if (!sepPoint) {
    output.value = prefix + text + suffix;
    return;
  }

  const parts = text.split(sepPoint);
  const result = parts.map((part, index) => {
    let segment = part;

    // Check if the separator should be added
    if (index < parts.length - 1) {
      segment += removeSep ? '' : sepPoint;
    }

    // Check if the 'separated by' string should be added to the last 'seperation point'
    const shouldAddSepBy = (index < parts.length - 1) && (!noTrailingSep || index < parts.length - 2);
    segment += shouldAddSepBy ? sepBy : '';

    // Check if prefix and suffix should be added to the end 
    const shouldAddPrefSuf = !(noTrailing_pref_suf && index === parts.length - 1);

    const currentPrefix = shouldAddPrefSuf ? prefix : '';
    const currentSuffix = shouldAddPrefSuf ? suffix : '';

    return currentPrefix + segment + currentSuffix + (newline ? '\n' : '');
  });

  output.value = result.join('');
}



// Event listeners
[
  input,
  separationPointInput,
  separatedByInput,
  prefixInput,
  suffixInput,
  removeSeparator,
  addNewLine,
  noTrailingSeparator,
  noTrailing_prefix_suffix,
].forEach(el => el.addEventListener('input', processText));

copyBtn.addEventListener('click', () => {
  output.select();
  document.execCommand('copy');
  copiedIndicator.style.display = 'inline';
  setTimeout(() => copiedIndicator.style.display = 'none', 1000);
});

pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    input.value = text;
    processText();
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

clearInputsBtn.addEventListener('click', () => {
  separationPointInput.value = '';
  separatedByInput.value = '';
  prefixInput.value = '';
  suffixInput.value = '';
  removeSeparator.checked = true;
  addNewLine.checked = false;
  processText();
});


// Dark Mode toggle 
document.getElementById('theme-toggle-checkbox').addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
});

clearAllBtn.addEventListener('click', () => {
  input.value = '';
  output.value = '';
  copiedIndicator.style.display = 'none';
  separationPointInput.value = '';
  separatedByInput.value = '';
  prefixInput.value = '';
  suffixInput.value = '';
  removeSeparator.checked = true;
  addNewLine.checked = false;
});

clearTextBtn.addEventListener('click', () => {
  input.value = '';
  processText();
});

downloadBtn.addEventListener('click', () => {
  const textToDownload = output.value;
  const blob = new Blob([textToDownload], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
