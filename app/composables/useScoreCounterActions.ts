import type {MenuItem} from "primevue/menuitem";
import type {Player} from "~/types/global";

export const useScoreCounterActions = () => {
  const roomStore = useRoomStore();
  const {values: quickScoreValues} = useQuickScoreValues();
  const {record: recordScoreChange} = useScoreHistory();

  const interval = ref<ReturnType<typeof setInterval> | null>(null);
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
  const speedUpTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
  const intervalSpeed = ref(100);

  const applyScoreMutation = (player: Player, mutate: () => void) => {
    const before = roomStore.getPlayerScore(player)?.score ?? 0;
    mutate();
    const after = roomStore.getPlayerScore(player)?.score ?? before;

    if (after !== before) recordScoreChange(player.uuid, before, after);
  };

  const handleIncrementScore = (player: Player) => {
    applyScoreMutation(player, () => roomStore.incrementScore(player));
  };

  const handleDecrementScore = (player: Player) => {
    applyScoreMutation(player, () => roomStore.decrementScore(player));
  };

  const handleStartPress = (action: () => void) => {
    action();

    timeout.value = setTimeout(() => {
      interval.value = setInterval(action, intervalSpeed.value);

      speedUpTimeout.value = setTimeout(() => {
        if (interval.value) clearInterval(interval.value);
        intervalSpeed.value = 50;
        interval.value = setInterval(action, intervalSpeed.value);
      }, 1000);
    }, 300);
  };

  const handleStopPress = () => {
    if (timeout.value) clearTimeout(timeout.value);
    if (speedUpTimeout.value) clearTimeout(speedUpTimeout.value);
    if (interval.value) clearInterval(interval.value);

    timeout.value = null;
    speedUpTimeout.value = null;
    interval.value = null;
    intervalSpeed.value = 100;
  };

  const editingPlayerUuid = ref<string | null>(null);
  const editValue = ref('');

  const editingPlayer = computed(() => roomStore.players.find((player) => player.uuid === editingPlayerUuid.value) ?? null);

  const vFocus = {
    mounted: (el: HTMLInputElement) => {
      el.focus();
    },
  };

  // Tracks whether the player has interacted with the pre-filled score since
  // opening the editor, so the first digit typed replaces it outright
  // instead of appending to it (e.g. tapping "5" on a score of "10" yields
  // "5", not "105"). Typing +/- first, or backspacing, keeps the pre-filled
  // value as the calculation base.
  const editTouched = ref(false);

  const startEditingScore = (player: Player) => {
    editingPlayerUuid.value = player.uuid;
    editValue.value = String(roomStore.getPlayerScore(player)?.score || 0);
    editTouched.value = false;
  };

  const appendEditChar = (char: string) => {
    if (!editTouched.value && /^\d$/.test(char)) {
      editValue.value = char;
    } else {
      editValue.value += char;
    }

    editTouched.value = true;
  };

  const removeLastEditChar = () => {
    editValue.value = editValue.value.slice(0, -1);
    editTouched.value = true;
  };

  const parseScoreInput = (value: string, currentScore: number): number | null => {
    const trimmed = value.replace(/\s+/g, '');

    if (/^[+-]?\d+$/.test(trimmed)) {
      return parseInt(trimmed, 10);
    }

    const calcMatch = trimmed.match(/^(-?\d+)?((?:[+-]\d+)+)$/);
    if (calcMatch) {
      const [, base, operations] = calcMatch;
      let result = base !== undefined ? parseInt(base, 10) : currentScore;

      for (const [, sign, amount] of operations!.matchAll(/([+-])(\d+)/g)) {
        result = sign === '+' ? result + parseInt(amount!, 10) : result - parseInt(amount!, 10);
      }

      return result;
    }

    return null;
  };

  const applyScoreEdit = (player: Player) => {
    if (editingPlayerUuid.value !== player.uuid) return;

    const currentScore = roomStore.getPlayerScore(player)?.score || 0;
    const newScore = parseScoreInput(editValue.value, currentScore);

    if (newScore !== null) {
      applyScoreMutation(player, () => roomStore.setScore(player, newScore));
    }

    editingPlayerUuid.value = null;
  };

  const getButtonColor = (color: string, type: 'light' | 'dark'): string => {
    return adjustColor(color, type);
  };

  const handleQuickScoreChange = (player: Player, delta: number) => {
    const currentScore = roomStore.getPlayerScore(player)?.score ?? 0;
    applyScoreMutation(player, () => roomStore.setScore(player, currentScore + delta));
  };

  const getQuickDecrementItems = (player: Player): MenuItem[] => quickScoreValues.value.map((value) => ({
    label: `-${value}`,
    command: () => handleQuickScoreChange(player, -value),
  }));

  const getQuickIncrementItems = (player: Player): MenuItem[] => quickScoreValues.value.map((value) => ({
    label: `+${value}`,
    command: () => handleQuickScoreChange(player, value),
  }));

  return {
    handleIncrementScore,
    handleDecrementScore,
    handleStartPress,
    handleStopPress,
    editingPlayerUuid,
    editingPlayer,
    editValue,
    vFocus,
    startEditingScore,
    appendEditChar,
    removeLastEditChar,
    applyScoreEdit,
    getButtonColor,
    getQuickDecrementItems,
    getQuickIncrementItems,
  };
};