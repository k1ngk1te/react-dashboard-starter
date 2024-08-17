export function contains(
	targetName: string | number = '',
	searchQuery: string = ''
) {
	const searchWords = searchQuery.toLowerCase().split(' ');
	const targetNameLower = targetName.toString().toLowerCase();

	// Check if all words in the search query exist in the target name
	return searchWords.every((word) => targetNameLower.includes(word));
}
