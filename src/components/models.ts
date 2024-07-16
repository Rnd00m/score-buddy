export interface Player {
  id: number;
  name: string;
  score: number;
  color: Color;
}

export interface Color {
  name: string;
  textColor: string;
  value: string;
}

export const colors: Color[] = [
  {
    name: 'Red',
    textColor: 'white',
    value: '#F44336',
  },
  {
    name: 'Pink',
    textColor: 'white',
    value: '#D81B60',
  },
  {
    name: 'Purple',
    textColor: 'white',
    value: '#9C27B0',
  },
  {
    name: 'Indigo',
    textColor: 'white',
    value: '#3F51B5',
  },
  {
    name: 'Blue',
    textColor: 'white',
    value: '#2196F3',
  },
  {
    name: 'Green',
    textColor: 'white',
    value: '#4CAF50',
  },
  {
    name: 'Yellow',
    textColor: 'black',
    value: '#FFEB3B',
  },
  {
    name: 'Orange',
    textColor: 'black',
    value: '#FF9800',
  },
  {
    name: 'Deep Orange',
    textColor: 'white',
    value: '#FF5722',
  },
  {
    name: 'Brown',
    textColor: 'white',
    value: '#795548',
  },
  {
    name: 'Grey',
    textColor: 'white',
    value: '#9E9E9E',
  },
];
