"use client";

import { useSyncExternalStore } from "react";
import { audioStore } from "./manager";

/** The sound state, for each world's own sound control. */
export const useAudio = () => useSyncExternalStore(audioStore.subscribe, audioStore.get, audioStore.server);
