import type {MenuItem} from "primevue/menuitem";
import type {Player} from "~/types/global";

export const useScoreCounterActions = () => {
  const roomStore = useRoomStore();
  const {values: quickScoreValues} = useQuickScoreValues();

  const interval = ref<ReturnType<typeof setInterval> | null>(null);
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
  const speedUpTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
  const intervalSpeed = ref(100);

  const handleIncrementScore = (player: Player) => {
    roomStore.incrementScore(player);
  };

  const handleDecrementScore = (player: Player) => {
    roomStore.decrementScore(player);
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

  const vFocus = {
    mounted: (el: HTMLInputElement) => {
      el.focus();
    },
  };

  const startEditingScore = (player: Player) => {
    editingPlayerUuid.value = player.uuid;
    editValue.value = String(roomStore.getPlayerScore(player)?.score || 0);
  };

  const parseScoreInput = (value: string, currentScore: number): number | null => {
    const trimmed = value.replace(/\s+/g, '');

    const calcMatch = trimmed.match(/^(-?\d+)?([+-])(\d+)$/);
    if (calcMatch) {
      const [, base, sign, amount] = calcMatch;
      const baseValue = base !== undefined ? parseInt(base, 10) : currentScore;

      return sign === '+' ? baseValue + parseInt(amount!, 10) : baseValue - parseInt(amount!, 10);
    }

    if (/^\d+$/.test(trimmed)) {
      return parseInt(trimmed, 10);
    }

    return null;
  };

  const applyScoreEdit = (player: Player) => {
    if (editingPlayerUuid.value !== player.uuid) return;

    const currentScore = roomStore.getPlayerScore(player)?.score || 0;
    const newScore = parseScoreInput(editValue.value, currentScore);

    if (newScore !== null) {
      roomStore.setScore(player, newScore);
    }

    editingPlayerUuid.value = null;
  };

  const getButtonColor = (color: string, type: 'light' | 'dark'): string => {
    return adjustColor(color, type);
  };

  const handleQuickScoreChange = (player: Player, delta: number) => {
    const currentScore = roomStore.getPlayerScore(player)?.score ?? 0;
    roomStore.setScore(player, currentScore + delta);
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
    editValue,
    vFocus,
    startEditingScore,
    applyScoreEdit,
    getButtonColor,
    getQuickDecrementItems,
    getQuickIncrementItems,
  };
};