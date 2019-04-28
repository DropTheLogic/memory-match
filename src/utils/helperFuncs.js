import { adjectives, adverbs, nouns } from '../data';

/**
 * Returns random integer between given range
 * @param {integer} min - Minimum integer for range (inclusive)
 * @param {integer} max - Maximum integer for range (exclusive)
 */
export const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns title cased word from
 * @param {string} word - word to convert
 */
export const titleCase = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase();

/**
 * Returns given string without spaces
 * @param {string} string - word to convert
 */
export const removeSpaces = (word) => word.split(' ').join('');

/**
 * Returns string of random capital letters
 * @param {int} length - length of string to return (optional)
 */
export const generateRoomId = (length = 5) => {
	return new Array(length).fill('').map(char => {
		let num = getRandomInt(65, 91);
		let code = String.fromCharCode(num);
		return code;
	}).join('');
};

/**
 * Returns random three string "name"
 */
export const getRandomName = () => {
	let adverb = adverbs[getRandomInt(0, adverbs.length)];
	let adj = adjectives[getRandomInt(0, adjectives.length)];
	let noun = nouns[getRandomInt(0, nouns.length)];
	return `${titleCase(adverb)} ${titleCase(adj)} ${titleCase(noun)}`;
}

// With guidance from the incomparable David Walsh
// https://davidwalsh.name/javascript-debounce-function
/**
 * Returns a function
 * @param {function} fn - Function to execute
 * @param {integer} ms - length of time, in milliseconds, to wait to execute
 * @param {boolean} immediate - Immediately execute if so passed
 */
export const debounce = (fn, ms, immediate) => {
	let timeout;

	return function() {
		let context = this, args = arguments;
		let later = () => {
			timeout = null;
			if (!immediate) {
				fn.apply(context, args);
			}
		};
		let callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, ms);

		if (callNow) {
			fn.apply(context, args);
		}
	}
}
