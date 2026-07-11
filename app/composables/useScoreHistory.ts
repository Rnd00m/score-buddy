const DEBOUNCE_MS = 1500;

interface ScoreHistoryEntry {
  playerUuid: string;
  before: number;
  after: number;
}

const undoStack = ref<ScoreHistoryEntry[]>([]);
const redoStack = ref<ScoreHistoryEntry[]>([]);

let pendingEntry: ScoreHistoryEntry | null = null;
let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

const commitPending = () => {
  if (pendingTimeout) clearTimeout(pendingTimeout);
  pendingTimeout = null;

  if (pendingEntry && pendingEntry.before !== pendingEntry.after) {
    undoStack.value.push(pendingEntry);
    redoStack.value = [];
  }

  pendingEntry = null;
};

export const useScoreHistory = () => {
  // A change on the same player as the current pending entry resets the
  // DEBOUNCE_MS window (still the same action). A change on a different
  // player immediately commits the pending entry (a different action). If
  // the window elapses with no further change, the entry commits, and any
  // later change on that same player starts a brand new entry.
  const record = (playerUuid: string, before: number, after: number) => {
    if (pendingEntry && pendingEntry.playerUuid === playerUuid) {
      pendingEntry.after = after;
    } else {
      commitPending();
      pendingEntry = {playerUuid, before, after};
    }

    if (pendingTimeout) clearTimeout(pendingTimeout);
    pendingTimeout = setTimeout(commitPending, DEBOUNCE_MS);
  };

  const undo = (): ScoreHistoryEntry | null => {
    commitPending();

    const entry = undoStack.value.pop();
    if (!entry) return null;

    redoStack.value.push(entry);
    return entry;
  };

  const redo = (): ScoreHistoryEntry | null => {
    const entry = redoStack.value.pop();
    if (!entry) return null;

    undoStack.value.push(entry);
    return entry;
  };

  const clear = () => {
    if (pendingTimeout) clearTimeout(pendingTimeout);
    pendingTimeout = null;
    pendingEntry = null;

    undoStack.value = [];
    redoStack.value = [];
  };

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  return {
    record,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };
};
