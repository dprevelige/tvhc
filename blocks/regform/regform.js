const STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

function createFieldWrapper(labelText, inputElement, required = false) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('regform-field');

  const label = document.createElement('label');
  label.textContent = labelText;
  if (required) {
    const requiredSpan = document.createElement('span');
    requiredSpan.classList.add('regform-required');
    requiredSpan.textContent = ' *';
    label.append(requiredSpan);
  }

  if (inputElement.id) {
    label.htmlFor = inputElement.id;
  }

  wrapper.append(label, inputElement);
  return wrapper;
}

function createSelect(name, id) {
  const select = document.createElement('select');
  select.name = name;
  select.id = id;
  return select;
}

function createInput(type, name, id, placeholder = '') {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = id;
  if (placeholder) {
    input.placeholder = placeholder;
  }
  return input;
}

function addOptionsToSelect(select, optionString) {
  const options = optionString.split(',');
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.append(optionElement);
  });
}

export default function decorate(block) {
  const eventNamesMaybe = block.querySelector('regform-event-names')?.value;
  const specialties = block.querySelector('regform-specialties')?.value;
  const eventNames = block.querySelector(':scope div:nth-child(1) > div');
console.log("eventNames: " + eventNames);
console.log("eventNamesMaybe: " + eventNamesMaybe);
  const form = document.createElement('form');
  form.classList.add('regform-form');
  form.method = 'post';
  form.action = 'https://hook.app.workfrontfusion.com/yd8it6ivn9muqn8x4f4v9jdx1sfef2ew';

  // Event Name (select, required)
  const eventSelect = createSelect('eventName', 'regform-event-name');
  addOptionsToSelect(eventSelect, eventNames);
  // const eventPlaceholder = document.createElement('option');
  // eventPlaceholder.value = '';
  // eventPlaceholder.textContent = 'Select Event';
  // eventPlaceholder.disabled = true;
  // eventPlaceholder.selected = true;
  // eventSelect.append(eventPlaceholder);
  eventSelect.required = true;
  form.append(createFieldWrapper('Event Name', eventSelect, true));

  // First Name (text, required)
  const firstNameInput = createInput('text', 'firstName', 'regform-first-name', 'First Name');
  firstNameInput.required = true;
  form.append(createFieldWrapper('First Name', firstNameInput, true));

  // Last Name (text, required)
  const lastNameInput = createInput('text', 'lastName', 'regform-last-name', 'Last Name');
  lastNameInput.required = true;
  form.append(createFieldWrapper('Last Name', lastNameInput, true));

  // State (select, required)
  const stateSelect = createSelect('state', 'regform-state');
  const statePlaceholder = document.createElement('option');
  statePlaceholder.value = '';
  statePlaceholder.textContent = 'Select State';
  statePlaceholder.disabled = true;
  statePlaceholder.selected = true;
  stateSelect.append(statePlaceholder);
  STATES.forEach((state) => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    stateSelect.append(option);
  });
  stateSelect.required = true;
  form.append(createFieldWrapper('State', stateSelect, true));

  // Phone (tel)
  const phoneInput = createInput('tel', 'phone', 'regform-phone', 'Phone');
  form.append(createFieldWrapper('Phone', phoneInput, false));

  // Email (email, required)
  const emailInput = createInput('email', 'email', 'regform-email', 'Email');
  emailInput.required = true;
  form.append(createFieldWrapper('Email', emailInput, true));

  // Specialty (select with Oncology / Neurology, required)
  const specialtySelect = createSelect('specialty', 'regform-specialty');
  const specialtyPlaceholder = document.createElement('option');
  specialtyPlaceholder.value = '';
  specialtyPlaceholder.textContent = 'Select Specialty';
  specialtyPlaceholder.disabled = true;
  specialtyPlaceholder.selected = true;
  specialtySelect.append(specialtyPlaceholder);

  ['Oncology', 'Neurology'].forEach((specialty) => {
    const option = document.createElement('option');
    option.value = specialty;
    option.textContent = specialty;
    specialtySelect.append(option);
  });

  specialtySelect.required = true;
  form.append(createFieldWrapper('Specialty', specialtySelect, true));

  // Submit button
  const submitWrapper = document.createElement('div');
  submitWrapper.classList.add('regform-actions');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('regform-submit');
  submitButton.textContent = 'Submit';
  submitWrapper.append(submitButton);

  form.append(submitWrapper);

  // Replace original block content
  block.innerHTML = '';
  block.append(form);
}

