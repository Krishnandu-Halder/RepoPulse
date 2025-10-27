export const GITHUB_API_BASE = 'https://api.github.com';

export const LANGUAGES = [
  'JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust',
  'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'HTML', 'CSS',
  'Shell', 'Dart', 'Scala', 'R', 'MATLAB', 'Perl'
];

export const SORT_OPTIONS = [
  { value: 'stars', label: 'Stars' },
  { value: 'forks', label: 'Forks' },
  { value: 'updated', label: 'Updated' },
  { value: 'name', label: 'Name' }
];

export const ORDER_OPTIONS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
];

export const DATE_RANGES = [
  { value: '', label: 'Any Time' },
  { value: '>2023-01-01', label: '2023 & Later' },
  { value: '>2022-01-01', label: '2022 & Later' },
  { value: '>2021-01-01', label: '2021 & Later' }
];