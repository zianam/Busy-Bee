import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { defaultBusyBeeData } from "../data/busyBeeData";

const COLLECTION_NAME = "busyBeeUsers";
const DEMO_USER_ID = "demo-user";
const LOCAL_STORAGE_KEY = "busy-bee-dashboard";

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const getUserDocRef = () => doc(db, COLLECTION_NAME, DEMO_USER_ID);

export async function loadBusyBeeData() {
  if (!isFirebaseConfigured) {
    const localData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return localData ? JSON.parse(localData) : cloneData(defaultBusyBeeData);
  }

  const userDoc = await getDoc(getUserDocRef());

  if (userDoc.exists()) {
    return userDoc.data();
  }

  const starterData = cloneData(defaultBusyBeeData);
  await saveBusyBeeData(starterData);
  return starterData;
}

export async function saveBusyBeeData(data) {
  if (!isFirebaseConfigured) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return;
  }

  await setDoc(
    getUserDocRef(),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function updateMicroWinStatus(data, microWinId, completed) {
  return {
    ...data,
    microWins: data.microWins.map((item) =>
      item.id === microWinId ? { ...item, completed } : item,
    ),
  };
}
