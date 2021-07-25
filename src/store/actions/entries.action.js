// ACTIONS
export const ADD_ENTRY = 'ADD_ENTRY';
export const RECIEVE_ENTRIES = 'RECIEVE_ENTRIES';

// ACTION CREATORS
export function addEntry(entry) {
  return {
    type: ADD_ENTRY,
    entry,
  };
}

export function receiveEntries(entries) {
  return {
    type: RECIEVE_ENTRIES,
    entries,
  };
}
