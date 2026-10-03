import log from 'loglevel'

export function shuffleArray(array, random = Math.random) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getRandomizedCharacters(allCharacters, owned, selectedCharacters, n, random = Math.random) {
  log.debug(`getRandomizedCharacters allCharacters=${JSON.stringify(allCharacters.map((c) => c.id))}, owned=${JSON.stringify(owned)}, selectedCharacters=${JSON.stringify(selectedCharacters)}, n=${n}`)

  const pool = allCharacters
    .filter((character) => owned.includes(character.id) && !selectedCharacters.includes(character.id))

  log.debug(`getRandomizedCharacters pool=${JSON.stringify(pool.map((c) => c.id))}`)

  return shuffleArray(pool, random).slice(0, n)
}

export function containsAll(mainList, subList) {
  return subList.every(element => mainList.includes(element));
}

// Computes the next draw. When repetition is disallowed, drawn ids accumulate in
// the selection history until it covers every owned character, then it resets.
export function nextDraw({ characters, owned, selectionHistory, isRepetitionAllowed, n, random = Math.random }) {
  if (isRepetitionAllowed) {
    const drawn = getRandomizedCharacters(characters, owned, [], n, random)
    return { drawn, newHistory: selectionHistory, poolReset: false }
  }

  let history = [...selectionHistory]
  let poolReset = false
  if (containsAll(history, owned)) {
    history = []
    poolReset = true
  }

  const drawn = getRandomizedCharacters(characters, owned, history, n, random)
  const newHistory = [...new Set([...history, ...drawn.map((c) => c.id)])]
  log.debug(`nextDraw drawn=${JSON.stringify(drawn.map((c) => c.id))}, newHistory=${JSON.stringify(newHistory)}`)

  return { drawn, newHistory, poolReset }
}
